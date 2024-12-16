const mongoose = require('mongoose');
const { Schema } = mongoose;
const db = require('../config/db');

const PostSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: false },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = db.model('Post', PostSchema);
