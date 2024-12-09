const mongoose = require('mongoose');
const db = require('../config/db'); // Assuming you are using a custom DB configuration
const { Schema } = mongoose;

// Cart Item Schema
const cartItemSchema = new Schema({
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
        default: 1,
    },
});

// Cart Schema
const cartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true, // Ensures one cart per user
    },
    items: [cartItemSchema], // Array of cart items
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
});

const CartModel = db.model('cart', cartSchema);
module.exports = CartModel;
