const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

// StoreSpecialOrderOption Schema
const storeSpecialOrderOptionSchema = new Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store',
        required: true,
    },
    name: {
        type: String, // e.g., "Custom-Made Cake", "Large Orders"
        required: true,
    },
    description: {
        type: String, // Short description of the option
        trim: true,
    },
    choices: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'specialOrderChoice', // References the choices available for this option
        },
    ],
    customizableFields: {
        // Boolean flags to indicate if these fields are needed
        size: { type: Boolean, default: false },
        quantity: { type: Boolean, default: false },
        notes: { type: Boolean, default: false },
        image: { type: Boolean, default: false },
        description: { type: Boolean, default: false },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const StoreSpecialOrderOptionModel = db.model(
    'storeSpecialOrderOption',
    storeSpecialOrderOptionSchema
);
module.exports = StoreSpecialOrderOptionModel;
