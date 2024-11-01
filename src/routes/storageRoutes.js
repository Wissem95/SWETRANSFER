const express = require("express");
const router = express.Router();
const storageController = require("../controllers/storageController");
const auth = require("../middleware/auth");
const { User } = require("../models");

router.get("/usage", auth, storageController.getStorageUsage);

module.exports = router;
