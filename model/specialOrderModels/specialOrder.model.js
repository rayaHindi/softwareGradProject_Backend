const mongoose = require('mongoose');
const db = require('../../config/db');
const { Schema } = mongoose;

const specialOrderSchema = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store',
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    orderItems: [
        {
            optionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'storeSpecialOrderOption',
                required: true,
            },
            selectedCustomFields: [
                {
                    fieldId: { type: String, required: true },
                    label: { type: String, required: true },// Corresponds to CustomField.id
                    selectedOptions: [String], // For dropdown and checkbox
                    customValue: String, // For text, number, date, imageUpload
                    extraCost: { type: Number, min: 0, default: 0 }, // Extra cost based on selection
                },
            ],
            requiresPhotoUpload: { type: Boolean, default: false },
            photoUploadPrompt: { type: String },
            photoUrl: { type: String }, // URL of the uploaded photo
            totalPrice: {
                type: Number, // Total price for this item (base + extra costs)
                required: false,
            },
        },
    ],
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'afterCheckout' ,'Completed', 'Cancelled'],
        default: 'Pending',
    },
    totalPrice: {
        type: Number, // Total price for the whole order
        required: false,
        default: 0,
    },
    estimatedPrice: {
        type: Number, // Estimated price based on user selections
        required: true,
    },
    notes: {
        type: String, // General notes for the order
        trim: true,
    },
    ifPaid: {
        type: Boolean,
        default: false, // Default to unread
    },
    deliveryDetails: {
        city: { type: String, required: false },
        street: { type: String, required: false },
        contactNumber: { type: String, required: false },
    },
    paymentDetails: {
        method: {
            type: String,
            enum: ['Cash on Delivery', 'Visa', 'Apple Pay'],
            required: false,
        },
        cardNumber: {
            type: String,
            default: null,
        },
    },

}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

const SpecialOrder = db.model('SpecialOrder', specialOrderSchema);
module.exports = SpecialOrder;
