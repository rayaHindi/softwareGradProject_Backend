const specialOrderChoiceSchema = new Schema({
    optionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'storeSpecialOrderOption', // Links to the option this choice belongs to
        required: true,
    },
    name: {
        type: String, // e.g., "Small", "Medium", "Chocolate Filling"
        required: true,
    },
    extraCost: {
        type: Number, // Additional cost for this choice
        min: 0,
        default: 0,
    },
    description: {
        type: String, // Description of this choice, if needed
        trim: true,
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

const SpecialOrderChoiceModel = db.model('specialOrderChoice', specialOrderChoiceSchema);
module.exports = SpecialOrderChoiceModel;
