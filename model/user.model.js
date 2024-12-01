const db = require('../config/db');
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const { Schema } = mongoose;

// defining schema "user"
const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        //match: [/^\d{10}$/, "Phone number format is not correct"], // Example regex for 10-digit number
        //unique: true
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "Email can't be empty"],
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Email format is not correct",
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
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
    },
    visaCard: {
        cardNumber: { type: String, required: false },
        expiryMonth: { type: String, required: false },
        expiryYear: { type: String, required: false },
        cardCode: { type: String, required: false },
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
    }
}, { timestamps: true });

userSchema.pre("save", async function () {
    var user = this;
    if (!user.isModified("password")) {
        return
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
    } catch (err) {
        throw err;
    }
});
//used while signIn decrypt
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        console.log('----------------no password', this.password);
        // @ts-ignore
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};
const UserModel = db.model('user', userSchema);
module.exports = UserModel;