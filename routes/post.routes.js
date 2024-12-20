const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');

// Route to create a new post
router.post('', postController.createPost);

// Optional route to fetch all posts
router.get('', postController.getAllPosts);

router.post('/:postId/like', postController.addLike); // Add like
router.post('/:postId/upvote', postController.addUpvote); // Add upvote
router.post('/:postId/comment', postController.addComment); // Add comment


module.exports = router;
