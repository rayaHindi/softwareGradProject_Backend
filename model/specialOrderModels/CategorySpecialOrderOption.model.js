// CategorySpecialOrderOption Model (categorySpecialOrderOption.model.js)
const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

const categorySpecialOrderOptionSchema = new Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category', // Assuming you have a Category model
        required: [true, "Category ID is required"],
    },
    name: {
        type: String,
        required: [true, 'Option name is required'],
        trim: true,
    },
    availableChoices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'specialOrderChoice',
    }],
    isOptional: {
        type: Boolean,
        default: false,
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

categorySpecialOrderOptionSchema.pre('save', function (next) {
this.updatedAt = Date.now();
next();
});

const CategorySpecialOrderOptionModel = db.model('categorySpecialOrderOption', categorySpecialOrderOptionSchema);
module.exports = CategorySpecialOrderOptionModel;