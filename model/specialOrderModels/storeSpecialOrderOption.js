// StoreSpecialOrderOption Model (storeSpecialOrderOption.model.js)
const storeSpecialOrderOptionSchema = new Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store', // Assuming you have a Store model
        required: [true, "Store ID is required"],
    },
    categoryOptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categorySpecialOrderOption',
        required: false, // Optional if the option is custom to the store
    },
    name: {
        type: String,
        required: [true, 'Option name is required'],
        trim: true,
    },
    availableChoices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'specialOrderChoice',
    }],
    isOptional: {
        type: Boolean,
        default: false,
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
    
    storeSpecialOrderOptionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
    });
    
    const StoreSpecialOrderOptionModel = db.model('storeSpecialOrderOption', storeSpecialOrderOptionSchema);
    module.exports = StoreSpecialOrderOptionModel;