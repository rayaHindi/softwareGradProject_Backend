// category.model.js
const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    stores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store',
        default: [], // Optional: set stores as an empty array initially
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

categorySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const CategoryModel = db.model('category', categorySchema);
module.exports = CategoryModel;
