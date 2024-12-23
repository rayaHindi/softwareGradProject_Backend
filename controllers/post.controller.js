const Post = require('../model/post.model');

// Create a new post (for users)
exports.createPost = async (req, res) => {
    try {
        console.log("im inside user post creation");
        const { firstName, lastName, email, content, images } = req.body;

        // Validate input
        if (!firstName || !lastName || !content) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Validate images
        if (images && !Array.isArray(images)) {
            return res.status(400).json({ message: 'Images must be an array of URLs.' });
        }
        fullName = firstName + lastName;
        // Create and save post
        const newPost = new Post({
            fullName,
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

// Create a new post (for stores)
exports.createStorePost = async (req, res) => {
    try {
        console.log("im inside store post creation");
        const { fullName, email, content, images } = req.body;

        // Validate input
        if (!fullName || !content) {

            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Validate images
        if (images && !Array.isArray(images)) {
            return res.status(400).json({ message: 'Images must be an array of URLs.' });
        }

        // Create and save post for store
        const newPost = new Post({
            fullName,
            email,
            content,
            images, // Include the images array
        });

        await newPost.save();

        res.status(201).json({
            message: 'Store post successfully created',
            post: newPost,
        });
    } catch (error) {
        console.error("Error creating store post:", error);
        res.status(500).json({
            message: 'An error occurred while creating the store post.',
        });
    }
};

exports.addLike = async (req, res) => {
    try {
        const { postId } = req.params;

        // Find the post and increment likes
        const post = await Post.findByIdAndUpdate(
            postId,
            { $inc: { likes: 1 } },
            { new: true } // Return the updated document
        );

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        res.status(200).json({ message: 'Like added successfully.', likes: post.likes });
    } catch (error) {
        console.error("Error adding like:", error);
        res.status(500).json({ message: 'An error occurred while adding a like.' });
    }
};

exports.addUpvote = async (req, res) => {
    try {
        const { postId } = req.params;

        // Find the post and increment upvotes
        const post = await Post.findByIdAndUpdate(
            postId,
            { $inc: { upvotes: 1 } },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        res.status(200).json({ message: 'Upvote added successfully.', upvotes: post.upvotes });
    } catch (error) {
        console.error("Error adding upvote:", error);
        res.status(500).json({ message: 'An error occurred while adding an upvote.' });
    }
};

// Add Downvote to a post
exports.addDownvote = async (req, res) => {
    try {
        const { postId } = req.params;

        // Find the post and decrement downvotes
        const post = await Post.findByIdAndUpdate(
            postId,
            { $inc: { downvotes: 1 } },
            { new: true } // Return the updated document
        );

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        res.status(200).json({ message: 'Downvote added successfully.', downvotes: post.downvotes });
    } catch (error) {
        console.error("Error adding downvote:", error);
        res.status(500).json({ message: 'An error occurred while adding a downvote.' });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { username, comment } = req.body;

        if (!username || !comment) {
            return res.status(400).json({ message: 'Username and comment are required.' });
        }

        // Find the post and add the comment
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        post.comments.push({ username, comment });
        await post.save();

        res.status(200).json({ message: 'Comment added successfully.', comments: post.comments });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: 'An error occurred while adding a comment.' });
    }
};

// Get all posts (optional functionality)
exports.getAllPosts = async (req, res) => {
    try {
        console.log("im inside the fetch");
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
        console.log("success");
    } catch (error) {
        console.log("failure");
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: 'An error occurred while fetching posts.' });
    }
};
