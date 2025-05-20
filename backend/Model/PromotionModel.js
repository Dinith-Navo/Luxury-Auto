const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    PROMOID: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    discountPercentage: { type: Number, required: true, min: 0, max: 100 },
    validFrom: { type: Date, required: true },
    validTo: { 
        type: Date, 
        required: true, 
        validate: {
            validator: function(v) {
                return v > this.validFrom; 
            },
            message: 'validTo must be greater than validFrom.'
        }
    },
    paymentMethods: {
        type: [String], // Array of strings to store different payment methods
        required: true,
        enum: ['Credit Card', 'Debit Card', 'PayPal', 'Net Banking', 'UPI'], // Example payment methods
        default: ['Credit Card'] // Default value
    }
});

module.exports = mongoose.model('Promotion', promotionSchema);
