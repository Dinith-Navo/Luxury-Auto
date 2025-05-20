const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    SupOrderID: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    quantity: { type: Number, required: true },
    InvID: { type: String, required: true },
    JID: { type: String, required: true },
    SupID: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
    date: { type: Date, required: true },
    description: { type: String, required: true }
});

module.exports = mongoose.model('Supplier', supplierSchema);
