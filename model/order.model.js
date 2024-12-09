const mongoose = require('mongoose');
const db = require('../config/db'); // Assuming you are using a custom DB configuration
const { Schema } = mongoose;

// Order Item Schema
const orderItemSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true,
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});

// Order Schema
const orderSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    items: [orderItemSchema], // All order items
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: 'Pending', // Possible statuses: Pending, Paid, Shipped, Delivered, Cancelled
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const OrderModel = db.model('order', orderSchema);
module.exports = OrderModel;
