const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Price cannot be negative"],
    },
    category: {
        type: String,
        required: [true, "Product category is required"],
        trim: true,
        enum: ["Cake", "Pastry", "Bread", "Electronics", "Clothing", "Other"],
    },
    stock: {
        type: Number,
        required: [true, "Stock quantity is required"],
        min: [0, "Stock cannot be negative"],
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    photo: {
        type: String, // URL of the uploaded image
        required: [true, "Product photo URL is required"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware to update `updatedAt` field before saving
productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create and export the model
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
