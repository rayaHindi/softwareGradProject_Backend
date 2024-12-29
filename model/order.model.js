const mongoose = require('mongoose');
const db = require('../config/db');
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
    pricePerUnitWithOptionsCost: {
        type: Number,
        required: true,
    },
    totalPriceWithQuantity: {
        type: Number,
        required: true,
    },
    selectedOptions: {
        type: Map,
        of: String,
        default: {},
    },
    deliveryType: {
        type: String, // 'instant' or 'scheduled'
        required: true,
    },
    storeTotal: {
        type: Number, // Total for the store
        required: true,
    },
    storeDeliveryCost: {
        type: Number, // Delivery cost for the store
        required: true,
    },
    storeStatus: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered'],
        default: 'Pending', // Default status for each store
    },
});

// Order Schema
const orderSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    items: [orderItemSchema], // Array of items from potentially multiple stores
    totalPrice: {
        type: Number,
        required: true,
    },
    deliveryDetails: {
        city: { type: String, required: true },
        street: { type: String, required: true },
        contactNumber: { type: String, required: true },
    },
    status: {
        type: String,
        enum: [
            'Pending',
            'Partially Shipped',
            //'Confirmed',
            //'In Progress',
            'Shipped',
            //'Out for Delivery',
            'Delivered',
            //'Cancelled',
            //'Failed',
            //'Returned',
            //'Refunded'
        ],
        default: 'Pending',
    },
    orderNumbers: {
        type: Map,
        of: Number,
        required: true, // Ensure it's always set
    },
    userOrderNumber: {
        type: Number, // Store user's order number
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const OrderModel = db.model('order', orderSchema);
module.exports = OrderModel;
