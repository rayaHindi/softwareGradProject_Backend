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
                    fieldId: { type: String, required: true }, // Corresponds to CustomField.id
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
                required: true,
            },
        },
    ],
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    totalPrice: {
        type: Number, // Total price for the whole order
        required: true,
    },
    estimatedPrice: {
        type: Number, // Estimated price based on user selections
        required: true,
    },
    notes: {
        type: String, // General notes for the order
        trim: true,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

const SpecialOrder = db.model('SpecialOrder', specialOrderSchema);
module.exports = SpecialOrder;
