const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    PID: { type: String, required: true, unique: true },
    amount: { type: Number},
    method: { type: String, required: true },
    status: { type: String, required: true },
    transactionDate: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', PaymentSchema);
module.exports = Payment;
