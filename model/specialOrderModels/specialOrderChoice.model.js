// SpecialOrderChoice Model (specialOrderChoice.model.js)
const specialOrderChoiceSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Choice name is required'],
        trim: true,
    },
    extraCost: {
        type: Number,
        min: [0, 'Extra cost cannot be negative'],
        default: 0,
    },
    description: {
        type: String,
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
    
    specialOrderChoiceSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
    });
    
    const SpecialOrderChoiceModel = db.model('specialOrderChoice', specialOrderChoiceSchema);
    module.exports = SpecialOrderChoiceModel;