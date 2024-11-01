const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB
    fieldSize: 2 * 1024 * 1024 * 1024, // 2GB
  },
}).single("file");

// Wrapper personnalisé pour une meilleure gestion des erreurs
const uploadMiddleware = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(400).json({
        message: "Erreur lors du téléchargement",
        error: err.message,
      });
    } else if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({
        message: "Erreur lors du téléchargement",
        error: err.message,
      });
    }

    // Vérification de l'espace de stockage
    const user = req.user;
    const fileSize = req.file ? req.file.size : 0;

    if (user.storage_used + fileSize > user.storage_limit) {
      return res.status(400).json({
        message: "Limite de stockage dépassée",
      });
    }

    next();
  });
};

module.exports = uploadMiddleware;
