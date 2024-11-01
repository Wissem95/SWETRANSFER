// src/routes/storageRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Assurez-vous que ce chemin est correct
const { User } = require('../models'); // Import du modèle User

// Route pour obtenir l'utilisation du stockage
router.get('/usage', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Obtenu via le middleware d'authentification

        // Récupérer l'utilisation du stockage depuis la base de données
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            storage_used: user.storage_used,
            storage_limit: user.storage_limit
        });

    } catch (error) {
        console.error('Error fetching storage usage:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch storage usage'
        });
    }
});

module.exports = router;