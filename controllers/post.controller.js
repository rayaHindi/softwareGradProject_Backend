const Post = require('../model/post.model');

// Create a new post
exports.createPost = async (req, res) => {
    try {
        console.log("im inside here");
        const { firstName, lastName, email, content, images } = req.body;

        // Validate input
        if (!firstName || !lastName || !content) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Validate images
        if (images && !Array.isArray(images)) {
            return res.status(400).json({ message: 'Images must be an array of URLs.' });
        }

        // Create and save post
        const newPost = new Post({
            firstName,
            lastName,
            email,
            content,
            images, // Include the images array
        });

        await newPost.save();

        res.status(201).json({
            message: 'Post successfully created',
            post: newPost,
        });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({
            message: 'An error occurred while creating the post.',
        });
    }
};

// Get all posts (optional functionality)
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: 'An error occurred while fetching posts.' });
    }
};
