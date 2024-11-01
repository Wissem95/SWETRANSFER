const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Routes protégées
router.post('/upload', auth, upload.single('file'), fileController.uploadFile);
router.get('/list', auth, fileController.listFiles);
router.post('/:id/share', auth, fileController.shareFile);
router.delete('/:id', auth, fileController.deleteFile);

// Route publique pour le téléchargement des fichiers partagés
router.get('/shared/:shareLink', fileController.downloadSharedFile);

module.exports = router;
