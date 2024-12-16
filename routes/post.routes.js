const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');

// Route to create a new post
router.post('', postController.createPost);

// Optional route to fetch all posts
router.get('/', postController.getAllPosts);

module.exports = router;
