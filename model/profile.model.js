const mongoose = require('mongoose');
const { Schema } = mongoose;

// Defining schema for "Profile"
const profileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user', // Reference to the "User" model
        required: true,
    },
    bio: {
        type: String,
        maxlength: 500, // Restrict bio length
        default: "",
    },
    profilePicture: {
        type: String, // URL or file path to the profile picture
        default: "",
    },
    stats: {
        posts: {
            type: Number,
            default: 0,
        },
        feedbacks: {
            type: Number,
            default: 0,
        },
        upvotes: {
            type: Number,
            default: 0,
        },
    },
}, { timestamps: true });

// Virtual field to fetch user first and last name from the User model
profileSchema.virtual('fullName').get(async function () {
    const user = await mongoose.model('user').findById(this.userId, 'firstName lastName');
    return `${user.firstName} ${user.lastName}`;
});

// Creating and exporting the Profile model
const ProfileModel = mongoose.model('profile', profileSchema);
module.exports = ProfileModel;
