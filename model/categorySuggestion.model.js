const mongoose = require('mongoose');
const { Schema } = mongoose;
const db = require('../config/db');

const categorySuggestionSchema = new Schema({
    categoryName: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    suggestedById: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    },
    suggestedByType: {
        type: String,
        enum: ['User', 'Store'],
        required: false,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    reviewedAt: {
        type: Date,
        default: null,
    },
});


const CategorySuggestionModel = db.model('CategorySuggestion', categorySuggestionSchema);
module.exports = CategorySuggestionModel;
