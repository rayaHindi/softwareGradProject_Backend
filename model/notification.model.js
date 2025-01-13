const mongoose = require('mongoose');
const db = require('../config/db'); // Use your configured database connection
const { Schema } = mongoose;

// Notification Schema
const notificationSchema = new Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true, // ID of the sender (User or Store)
        },
        senderType: {
            type: String,
            enum: ['user', 'store'], // Specify whether the sender is a user or store
            required: true,
        },
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true, // Either a User ID or a Store ID
        },
        recipientType: {
            type: String,
            enum: ['user', 'store'], // Specify whether the recipient is a user or store
            required: true,
        },
        title: {
            type: String,
            required: true, // Notification title
            trim: true,
        },
        message: {
            type: String,
            required: true, // Notification message
            trim: true,
        },
        metadata: {
            type: Object, // Optional additional data for custom use
        },
        isRead: {
            type: Boolean,
            default: false, // Default to unread
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

// Export the Notification model using your DB connection
const Notification = db.model('Notification', notificationSchema);
module.exports = Notification;
