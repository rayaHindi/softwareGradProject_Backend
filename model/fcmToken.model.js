const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

const fcmTokenSchema = new Schema(
    {
        userId: {
            type:
                mongoose.Schema.Types.ObjectId,
            ref:
                'user',
            required: false
        },
        storeId: {
            type:
                mongoose.Schema.Types.ObjectId,
            ref: 'store',
            required: false
        },
        fcmToken: {
            type: String,
            required: true
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        },
    },
    { timestamps: true }
);

// Ensure a unique combination of userId or storeId and fcmToken
fcmTokenSchema.index({ userId: 1, storeId: 1, fcmToken: 1 }, { unique: true });

const FCMToken = db.model('FCMToken', fcmTokenSchema);
module.exports = FCMToken;
