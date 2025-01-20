// models/Sale.js
const mongoose = require('mongoose');
const db = require('../config/db');

const SaleSchema = new mongoose.Schema({
    productIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product',
        required: true,
    },
    saleType: {
        type: String,
        enum: ['Percentage Discount', 'BOGO', 'Flat Discount'],
        required: false,
    },
    saleAmount: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    sendPushNotification: {
        type: Boolean,
        default: false,
    },
});

module.exports = db.model('Sale', SaleSchema);
