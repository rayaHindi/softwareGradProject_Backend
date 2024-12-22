// store.model.js
const mongoose = require('mongoose');
const db = require('../config/db');
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

// Store schema
const storeSchema = new Schema({
    logo: {
        type: String, // URL of the photo
        required: false,
        trim: true,
    },
    storeName: {
        type: String,
        required: true,
        trim: true, // Removes extra whitespace
        /// unique:true,
    },
    contactEmail: {
        type: String,
        lowercase: true,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    accountType: {
        type: String,
        enum: ['S', 'A'], // Example: 'S' for Store, 'A' for Admin
        required: true,
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'city', // Referencing the City model
        required: true
    },
    deliveryCities: {
        type: [
            {
                city: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'city',
                    required: true,
                },
                deliveryCost: {
                    type: Number,
                    required: true,
                    min: 0,
                },
            },
        ],
        default: [], // Default to an empty array
    },
    dateCreated: {
        type: Date,
        default: Date.now // Automatically set the creation date
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true // Make it required to ensure every store belongs to a category
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        default: [],
    }],
    allowSpecialOrders: {
        type: Boolean,
        default: false // Default to not allowing special orders
    },
    specialOrders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'specialOrder',
        default: [],
    }],
    visaCard: {
        cardNumber: { type: String, required: false },
        expiryMonth: { type: String, required: false },
        expiryYear: { type: String, required: false },
        cardCode: { type: String, required: false },
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
    },
    bio: {
        type: String,
        required: false,
        default: '', // Default to an empty string
        trim: true,
    },
    rating: {

    }
});

// Pre-save middleware for hashing the password
storeSchema.pre('save', async function () {
    try {
        const store = this;

        // Only hash the password if it has been modified or is new
        if (store.isModified('password')) {
            const bcrypt = require('bcrypt');
            const salt = await bcrypt.genSalt(10);
            store.password = await bcrypt.hash(store.password, salt);
        }
    } catch (error) {
        throw error;
    }
});

storeSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        console.log('----------------no password', this.password);
        // @ts-ignore
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};
// Compile model
const StoreModel = db.model('store', storeSchema);

module.exports = StoreModel;
