const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

const userActivitySchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true, // One activity record per user
    },
    lastVisitedCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        default: null, // Null if the user hasn't visited any category
    },
    lastVisitedProducts: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
            },
            visitedAt: {
                type: Date,
                default: Date.now, // Timestamp of the visit
            },
        },
    ],
    searchHistory: [
        {
            query: {
                type: String,
                required: true,
            },
            searchedAt: {
                type: Date,
                default: Date.now,
            },
            interactedProduct: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product', // Reference to the Product model
                default: null, // Null if no product interaction
            },
            interactedStore: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'store', // Reference to the Store model
                default: null, // Null if no store interaction
            },
        },
    ],
    viewedStores: [
        {
            storeId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'store',
            },
            viewedAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],

    lastInteractionDate: {
        type: Date,
        default: Date.now, // Updated whenever there's a new interaction
    },
});

const UserActivityModel = db.model('userActivity', userActivitySchema);
module.exports = UserActivityModel;
