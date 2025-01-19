const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

const productSchema = new Schema({
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
    salePrice: {
        type: Number,
        required: false,
        min: [0, "Price cannot be negative"],
    },
    image: {
        type: String, // URL of the photo
        required: false,
        trim: true,
    },
    category: {
        type: String,
        required: [true, "Product category is required"],
        trim: true,
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store', // Reference to the 'store' model
        required: true, // Make it required to ensure every product belongs to a store
    },
    stock: {
        type: Number,
        required: [true, "Stock quantity is required"],
        min: [0, "Stock cannot be negative"],
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    availableOptions: {
        type: mongoose.Schema.Types.Mixed, // Supports nested object structures
        default: {}, // Default is an empty object
    },
    availableOptionStatus: { // Updated field name
        type: mongoose.Schema.Types.Mixed, // Object to store optional/required status
        default: {}, // Default is an empty object
    },
    timeRequired: {
        type: Number,
        min: [1, "Time must be at least 1 unit"], // Time in minutes
    },
    isUponOrder: {
        type: Boolean,
        default: false
    },// New field for upon-order products
    allowDeliveryDateSelection: {/////////////////////new/////////////
        type: Boolean,
        default: false, // Default to false
    },
    tags: {
        type: [String],
        default: [], // Empty array by default //["vegan", "gluten-free", "organic"]
    },
    isVisible: {
        type: Boolean,
        default: true,
    },

    deliveryType: {/////////new///////////////
        type: String,
        enum: ['instant', 'scheduled'],
        default: 'instant',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    salesCount: {/////////new///////////////
        type: Number,
        default: 0,
    },
    searchCount: {
        type: Number,
        default: 0,
    },
    rating: {
        total: { type: Number, default: 0 }, // Sum of all ratings
        count: { type: Number, default: 0 }, // Total number of ratings
        average: { type: Number, default: 0 }, // Calculated as total / count
    },
    /* feedback: [{
         feedback: String, // User's text feedback
         createdAt: Date,
     }]*/
    onSale: {
        type: Boolean,
        default: false
    },
});

productSchema.pre("save", function (next) {
    // Automatically set `deliveryType` to 'scheduled' if `isUponOrder` is true
    if (this.isUponOrder) {
        this.deliveryType = 'scheduled';
    }
    this.allowDeliveryDateSelection = false; // Automatically disable date selection for instant

    this.inStock = this.stock > 0 && !this.isUponOrder; // Stock doesn't matter for made-to-order
    this.updatedAt = Date.now(); // Update timestamp
    next();
});
productSchema.pre("validate", function (next) {
    if (this.isUponOrder && (this.timeRequired == null || this.timeRequired <= 0)) {
        return next(new Error("Scheduled products must have a valid 'timeRequired' value greater than 0."));
    }
    next();
});


const ProductModel = db.model('product', productSchema);
module.exports = ProductModel;

