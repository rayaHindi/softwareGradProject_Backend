const mongoose = require('mongoose');
const db = require('../config/db');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

// Updated user schema
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true // Removes extra whitespace
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        /*  validate: {
              validator: function (v) {
                  return /^\+?[1-9]\d{1,14}$/.test(v); // Validate international phone number format
              },
              message: props => `${props.value} is not a valid phone number!`
          }*/
    },
    password: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        enum: ['U', 'A'], // Example: 'U' for User, 'A' for Admin
        required: true,
        default: 'U'
    },
    selectedGenres: {
        type: [String], // Array of strings
        default: [] // Default to empty array
    }
});

// Pre-save middleware for hashing the password
userSchema.pre('save', async function () {
    try {
        const user = this;

        // Only hash the password if it has been modified or is new
        if (user.isModified('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    } catch (error) {
        throw error;
    }
});

// Compile model
const UserModel = db.model('user', userSchema);

module.exports = UserModel;
