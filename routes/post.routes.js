const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const authenticateToken = require('../middleware/authMiddleware');

// Route to create a new post
router.post('/userCreate', authenticateToken, postController.createPost);
router.post('/storeCreate', authenticateToken, postController.createStorePost);


// Optional route to fetch all posts
router.get('', postController.getAllPosts);

router.post('/:postId/like', postController.addLike); // Add like
router.post('/:postId/upvote', postController.addUpvote); // Add upvote
router.post('/:postId/comment', postController.addComment); // Add comment
router.post('/:postId/downvote', postController.addDownvote);


module.exports = router;
