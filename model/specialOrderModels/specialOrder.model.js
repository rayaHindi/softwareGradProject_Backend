const specialOrderSchema = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // References the user placing the order
        required: true,
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store', // References the store the order is for
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    orderItems: [
        {
            optionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'storeSpecialOrderOption', // References the selected option
                required: true,
            },
            selectedChoices: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'specialOrderChoice', // References the selected choices
                },
            ],
            additionalFields: {
                size: { type: String, trim: true }, // Optional: Size (e.g., Small, Medium, Large)
                quantity: { type: Number, min: 1, default: 1 },
                notes: { type: String, trim: true }, // Optional: Custom notes
                imageUrl: { type: String }, // Optional: Uploaded image URL
            },
            totalPrice: {
                type: Number, // Total price for this item (including choices)
                required: true,
            },
        },
    ],
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    totalPrice: {
        type: Number, // Total price for the whole order
        required: true,
    },
    notes: {
        type: String, // General notes for the order
        trim: true,
    },
});

const SpecialOrderModel = db.model('specialOrder', specialOrderSchema);
module.exports = SpecialOrderModel;
