const { File, User } = require("../models");
const path = require("path");
const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

const fileController = {
  // Upload d'un fichier
  async uploadFile(req, res) {
    try {
      console.log("Starting file upload process...");

      if (!req.file) {
        console.error("No file received in request");
        return res.status(400).json({ message: "Aucun fichier reçu" });
      }

      console.log("File details:", {
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
      });

      const file = await File.create({
        original_name: req.file.originalname,
        file_name: req.file.filename,
        mime_type: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        user_id: req.user.id,
      });

      await User.increment("storage_used", {
        by: req.file.size,
        where: { id: req.user.id },
      });

      res.status(201).json({
        message: "Fichier téléchargé avec succès",
        file: {
          id: file.id,
          original_name: file.original_name,
          size: file.size,
          mime_type: file.mime_type,
        },
      });
    } catch (error) {
      console.error("Detailed upload error:", error);
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error("Error removing file:", unlinkError);
        }
      }
      res.status(500).json({
        message: "Erreur lors du téléchargement du fichier",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Liste des fichiers de l'utilisateur
  async listFiles(req, res) {
    try {
      console.log("Listing files for user:", req.user.id);

      const files = await File.findAll({
        where: { user_id: req.user.id },
        attributes: [
          "id",
          "original_name",
          "size",
          "mime_type",
          "createdAt",
          "share_link",
        ],
      });

      console.log("Found files:", files);

      res.json({ files });
    } catch (error) {
      console.error("List files detailed error:", error);
      res.status(500).json({
        message: "Error listing files",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Générer un lien de partage
  async shareFile(req, res) {
    try {
      const fileId = req.params.id;
      const file = await File.findOne({
        where: { id: fileId, user_id: req.user.id },
      });

      if (!file) {
        return res.status(404).json({ message: "Fichier non trouvé" });
      }

      // Générer un nouveau lien de partage
      const shareLink = uuidv4();
      const shareExpiration = new Date();
      shareExpiration.setDate(shareExpiration.getDate() + 7); // Expire dans 7 jours

      await file.update({
        share_link: shareLink,
        share_expiration: shareExpiration,
      });

      res.json({
        message: "Lien de partage généré avec succès",
        share_link: shareLink,
      });
    } catch (error) {
      console.error("Share file error:", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la génération du lien de partage" });
    }
  },

  // Télécharger un fichier partagé
  async downloadSharedFile(req, res) {
    try {
      const shareLink = req.params.shareLink;
      console.log("Attempting to download file with share link:", shareLink);

      const file = await File.findOne({
        where: {
          share_link: shareLink,
          share_expiration: {
            [Op.gt]: new Date(), // Vérifie que le lien n'a pas expiré
          },
        },
      });

      if (!file) {
        console.log("File not found or expired for share link:", shareLink);
        return res.status(404).json({
          message: "Fichier non trouvé ou lien expiré",
        });
      }

      console.log("File found, sending:", file.original_name);
      res.download(file.path, file.original_name);
    } catch (error) {
      console.error("Download shared file error:", error);
      res.status(500).json({
        message: "Erreur lors du téléchargement du fichier",
      });
    }
  },

  // Supprimer un fichier
  async deleteFile(req, res) {
    try {
      const { id } = req.params;
      const file = await File.findOne({
        where: { id, user_id: req.user.id },
      });

      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      // Supprimer le fichier physique
      await fs.unlink(file.path);

      // Mettre à jour l'espace utilisé
      await User.decrement("storage_used", {
        by: file.size,
        where: { id: req.user.id },
      });

      // Supprimer l'entrée en base
      await file.destroy();

      res.json({ message: "File deleted successfully" });
    } catch (error) {
      console.error("Delete file error:", error);
      res.status(500).json({ message: "Error deleting file" });
    }
  },
};

module.exports = fileController;
