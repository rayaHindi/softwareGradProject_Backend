const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

const advertisementSchema = new Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store',
        required: true,
    },
    image: {
        type: String, // URL or path to the image
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                // Ensure endDate is within `maxDaysDuration` of startDate
                const maxDuration = this.maxDaysDuration || 7; // Use the set value or default to 7
                const diffInMs = value.getTime() - this.startDate.getTime();
                return diffInMs <= maxDuration * 24 * 60 * 60 * 1000;
            },
            message: function () {
                return `Advertisements cannot last longer than ${this.maxDaysDuration || 7} days.`;
            },
        },
    },
    maxDaysDuration: {
        type: Number,
        default: 7, // Default max duration (in days)
        min: 1, // Minimum allowed duration
    },
    status: {
        type: String,
        enum: ['Pending', 'Active', 'Expired'],
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware to auto-expire ads when saved after endDate
advertisementSchema.pre('save', function (next) {
    if (this.endDate < new Date()) {
        this.status = 'Expired';
    }
    next();
});

const AdvertisementModel = db.model('advertisement', advertisementSchema);
module.exports = AdvertisementModel;
