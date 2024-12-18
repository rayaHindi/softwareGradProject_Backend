const mongoose = require('mongoose');
const { Schema } = mongoose;
const db = require('../config/db');

const CommentSchema = new Schema({
    username: { type: String, required: true },
    comment: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const PostSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: false },
    content: { type: String, required: true },
    images: { type: [String], default: [] }, // Array of image URLs
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 }, // Number of likes
    upvotes: { type: Number, default: 0 }, // Number of upvotes
    downvotes: { type: Number, default: 0 }, // Add downvotes field
    comments: { type: [CommentSchema], default: [] }, // Array of comments
});

module.exports = db.model('Post', PostSchema);
