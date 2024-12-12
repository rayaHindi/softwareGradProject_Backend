const mongoose = require('mongoose');
const { Schema } = mongoose;
const db = require('../config/db');

const citySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    storesCount: {
        type: Number,
        default: 0
    }
});

const CityModel = db.model('city', citySchema);
module.exports = CityModel
