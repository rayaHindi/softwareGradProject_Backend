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
        required: true,
    },
    timePickingAllowed: {
        type: Boolean,
        default: false, // Default to false if not specified
    },
    selectedDate: {
        type: Date,
        required: function () {
            return this.deliveryType === 'scheduled' && this.timePickingAllowed;
        }, // Required only if `timePickingAllowed` is true
    },
    selectedTime: {
        type: String, // You can use 'String' or a specific format like 'HH:mm'
        required: function () {
            return this.deliveryType === 'scheduled' && this.timePickingAllowed;
        }, // Required only if `timePickingAllowed` is true
    },
    hasRatedProduct: {
        type: Boolean,
        default: false, // Default to not rated
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
    deliveryPreference: {
        type: String,
        enum: ['Deliver All Together', 'Deliver When Ready'], // Allowed options
        required: true, // Make it mandatory to ensure the preference is always provided
    },
    orderDeliveryType: {
        type: String,
        enum: ['instant', 'scheduled'], // Allowed values
        required: true, // Make it mandatory
        default: 'instant',
    },
    hasRatedStore: {
        type: Boolean,
        default: false, // Default to not rated
    },
    paymentDetails: {
        method: {
            type: String,
            enum: ['Cash on Delivery', 'Visa', 'Apple Pay'],
            required: true,
        },
        cardNumber: {
            type: String,
            default:null,
            required: false,

        },
    },
    
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const OrderModel = db.model('order', orderSchema);
module.exports = OrderModel;
