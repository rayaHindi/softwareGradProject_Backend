const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

// Store schema
const storeSchema = new Schema({
    storeName: {
        type: String,
        required: true,
        trim: true // Removes extra whitespace
    },
    contactEmail: {
        type: String,
        lowercase: true,
        required: true,
        // unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        // unique: true,
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
        enum: ['S', 'A'], // Example: 'S' for Store, 'A' for Admin
        required: true,
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    allowSpecialOrders: {
        type: Boolean,
        default: false // Default to not allowing special orders
    },
    selectedGenre: {
        type: String, // Single genre as a string
        required: true // Make it required to ensure every store has a genre
    },
    dateCreated: {
        type: Date,
        default: Date.now // Automatically set the creation date
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

// Compile model
const StoreModel = db.model('store', storeSchema);

module.exports = StoreModel;
