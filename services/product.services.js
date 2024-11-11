const db = require('../config/db');
const mongoose = require('mongoose');
const { Schema } = mongoose;

// defining schema "product"
const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be a positive number"]
    },
    specialNote: {
        type: String,
        trim: true,
        maxlength: 200 // Limiting note length to 200 characters
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [0, "Quantity must be a positive number"]
    },
    availableOptions: {
        type: [String], // Array of strings to support different options like colors, sizes
        default: []
    },
    timeRequired: {
        type: Number,
        required: [true, "Production time is required"],
        min: [1, "Time must be at least 1 unit"], // Represents time in minutes, hours, etc.
        default: 1
    },
    // Optionally add categoryId and businessId fields in the future
    // categoryId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Category' // Refers to the Category model, if defined later
    // },
    // businessId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Business' // Refers to the Business model, if defined later
    // }
}, { timestamps: true });

// Creating the product model
const ProductModel = db.model('Product', productSchema);
module.exports = ProductModel;
