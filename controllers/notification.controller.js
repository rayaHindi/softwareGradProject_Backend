const Notification = require('../model/notification.model');

// Add a new notification
exports.addNotification = async (req, res) => {
    try {
        const { senderId, senderType, recipientId, recipientType, title, message, metadata } = req.body;

        if (!senderId || !senderType || !recipientId || !recipientType || !title || !message) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const newNotification = new Notification({
            senderId,
            senderType,
            recipientId,
            recipientType,
            title,
            message,
            metadata,
        });

        const savedNotification = await newNotification.save();
        res.status(201).json({ message: 'Notification added successfully', notification: savedNotification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add notification', error: error.message });
    }
};

// Get all notifications for a specific user or store
exports.getNotifications = async (req, res) => {
    try {
        const { userType } = req.query; // 'user' or 'store'
        const recipientId = req.user._id;

        console.log(`in getNotifications : ${recipientId}`);

        const notifications = await Notification.find({
            recipientId,
            recipientType: userType,
        }).sort({ createdAt: -1 }); // Most recent notifications first
        console.log('Notifications retrieved successfully');
        res.status(200).json({ message: 'Notifications retrieved successfully', notifications });
    } catch (error) {
        console.error(`error fetching notifications: ${error}`);
        res.status(500).json({ message: 'Failed to retrieve notifications', error: error.message });
    }
};
// Mark a notification as read
exports.markAsRead = async (req, res) => {
    try {
        console.log('in markAsRead');
        const { id } = req.params;

        const notification = await Notification.findByIdAndUpdate(
            id,
            { $set: { isRead: true } },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to mark notification as read', error: error.message });
    }
};
