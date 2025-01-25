const express = require('express');
const router = express.Router();
const fcmController = require('../controllers/fcmToken.controller');
const authenticateToken = require('../middleware/authMiddleware');

// Save or update FCM token
router.post('/saveToken', authenticateToken, fcmController.saveToken);

// Delete an FCM token
router.delete('/deleteToken', authenticateToken, fcmController.deleteToken);

// Get all FCM tokens for a user or store
router.get('/getToken', fcmController.getToken);

router.get('/getAllTokens', fcmController.getAllTokens);

module.exports = router;
