// SpecialOrder Model (specialOrder.model.js)
const specialOrderSchema = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Assuming you have a User model for customers
        required: [true, "Customer ID is required"],
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store', // Assuming you have a Store model
        required: [true, "Store ID is required"],
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    specialOrderOptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'storeSpecialOrderOption',
    }],
    notes: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    totalPrice: {
        type: Number,
        min: [0, "Total price cannot be negative"],
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
    
    specialOrderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
    });
    
    const SpecialOrderModel = db.model('specialOrder', specialOrderSchema);
    module.exports = SpecialOrderModel;
    
    