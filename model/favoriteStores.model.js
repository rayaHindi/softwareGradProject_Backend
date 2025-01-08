const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;
const favoriteStoreSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store',
        required: true,
    },
}, { timestamps: true });

const FavoriteStoreModel = db.model('favoriteStore', favoriteStoreSchema);
module.exports = FavoriteStoreModel;
