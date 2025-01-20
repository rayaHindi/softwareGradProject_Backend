const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;


const SubscriptionPlanSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        features: {
            type: [String],
            required: true
        },
        duration: {
            type: Number, // Number of months for the subscription
            required: true,
        },
    },
    { timestamps: true }
);

const SubscriptionPlan = db.model("SubscriptionPlan", SubscriptionPlanSchema);

module.exports = SubscriptionPlan;
