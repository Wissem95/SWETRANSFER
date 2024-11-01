const { File, User } = require('../models');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

const fileController = {
  // Upload d'un fichier
  async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const file = await File.create({
        original_name: req.file.originalname,
        file_name: req.file.filename,
        mime_type: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        user_id: req.user.id
      });

      // Mettre à jour l'espace utilisé
      await User.increment('storage_used', {
        by: req.file.size,
        where: { id: req.user.id }
      });

      res.status(201).json({
        message: 'File uploaded successfully',
        file: {
          id: file.id,
          original_name: file.original_name,
          size: file.size,
          mime_type: file.mime_type
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Error uploading file' });
    }
  },

  // Liste des fichiers de l'utilisateur
  async listFiles(req, res) {
    try {
      console.log('Listing files for user:', req.user.id);

      const files = await File.findAll({
        where: { user_id: req.user.id },
        attributes: ['id', 'original_name', 'size', 'mime_type', 'createdAt', 'share_link']
      });

      console.log('Found files:', files);

      res.json({ files });
    } catch (error) {
      console.error('List files detailed error:', error);
      res.status(500).json({ 
        message: 'Error listing files',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Générer un lien de partage
  async shareFile(req, res) {
    try {
      const { id } = req.params;
      const file = await File.findOne({
        where: { id, user_id: req.user.id }
      });

      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }

      const shareLink = uuidv4();
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);

      await file.update({
        share_link: shareLink,
        share_link_expiry: expiryDate
      });

      const baseUrl = process.env.API_URL || 'http://localhost:3000';
      res.json({
        message: 'Share link generated',
        share_link: `${baseUrl}/api/files/shared/${shareLink}`
      });
    } catch (error) {
      console.error('Share file error:', error);
      res.status(500).json({ message: 'Error sharing file' });
    }
  },

  // Télécharger un fichier partagé
  async downloadSharedFile(req, res) {
    try {
      const { shareLink } = req.params;
      const file = await File.findOne({
        where: {
          share_link: shareLink,
          share_link_expiry: {
            [Op.gt]: new Date()
          }
        }
      });

      if (!file) {
        return res.status(404).json({ message: 'File not found or link expired' });
      }

      res.download(file.path, file.original_name);
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ message: 'Error downloading file' });
    }
  },

  // Supprimer un fichier
  async deleteFile(req, res) {
    try {
      const { id } = req.params;
      const file = await File.findOne({
        where: { id, user_id: req.user.id }
      });

      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }

      // Supprimer le fichier physique
      await fs.unlink(file.path);

      // Mettre à jour l'espace utilisé
      await User.decrement('storage_used', {
        by: file.size,
        where: { id: req.user.id }
      });

      // Supprimer l'entrée en base
      await file.destroy();

      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({ message: 'Error deleting file' });
    }
  }
};

module.exports = fileController;
