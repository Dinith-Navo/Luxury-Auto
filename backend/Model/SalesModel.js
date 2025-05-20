const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
    saleId: { type: String }, 
    vehicleId: { type: String },
    rentalPeriod: { type: String, required: true },
    totalAmount: { type: String, required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Sale', SaleSchema);
