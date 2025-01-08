const express = require("express");
const profileController = require("../controllers/profile.controller");
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

// Get user profile by userId
router.get("", authenticateToken, profileController.getProfile);

// Update user profile
router.put("/:userId", profileController.updateProfile);

// Update stats
router.patch("/:userId/stats", profileController.updateStats);

module.exports = router;
