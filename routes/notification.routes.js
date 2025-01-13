const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const authenticateToken = require('../middleware/authMiddleware');

// Add a new notification
router.post('/addNotification', authenticateToken, notificationController.addNotification);

// Get all notifications for a user or store
router.get('/getNotifications', authenticateToken, notificationController.getNotifications);

// Mark a notification as read
router.patch('/markAsRead/:id', authenticateToken, notificationController.markAsRead);

module.exports = router;
