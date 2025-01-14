// models/specialOrderModels/storeSpecialOrderOption.model.js

const mongoose = require('mongoose');
const db = require('../../config/db'); // Ensure this path is correct
const { Schema } = mongoose;

// Define the CustomField schema
const CustomFieldSchema = new Schema({
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, enum: ['text', 'number', 'dropdown', 'checkbox', 'imageUpload', 'date'], required: true },
    isRequired: { type: Boolean, default: false },
    options: [
        {
            value: { type: String, required: true },
            extraCost: { type: Number, default: 0 },
        },
    ],
    extraCost: { type: Number, default: 0 },
});

// Define the StoreSpecialOrderOption schema
const StoreSpecialOrderOptionSchema = new Schema({
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'store', required: true },
    name: { type: String, required: true },
    description: { type: String },
    customFields: [CustomFieldSchema],
    requiresPhotoUpload: { type: Boolean, default: false },
    photoUploadPrompt: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Corrected variable name from 'storeSpecialOrderOptionSchema' to 'StoreSpecialOrderOptionSchema'
const StoreSpecialOrderOptionModel = db.model(
    'storeSpecialOrderOption',
    StoreSpecialOrderOptionSchema
);

module.exports = StoreSpecialOrderOptionModel;
