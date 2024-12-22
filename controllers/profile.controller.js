const ProfileModel = require("../model/profile.model");

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        console.log("im inside the getProfile");
        //const profileId = req.user._id;

        const profile = await ProfileModel.findOne({ userId: req.user._id }); // Using `req.user._id` for authenticated user

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const response = {
            bio: profile.bio,
            profilePicture: profile.profilePicture,
            stats: profile.stats,
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { bio, profilePicture } = req.body;

        const profile = await ProfileModel.findOneAndUpdate(
            { userId: req.user._id },
            { bio, profilePicture },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json({ message: "Profile updated successfully", profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update profile stats
exports.updateStats = async (req, res) => {
    try {
        const { posts, feedbacks, upvotes } = req.body;

        const profile = await ProfileModel.findOneAndUpdate(
            { userId: req.user._id },
            {
                $set: {
                    "stats.posts": posts,
                    "stats.feedbacks": feedbacks,
                    "stats.upvotes": upvotes,
                },
            },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json({ message: "Stats updated successfully", stats: profile.stats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
