const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    EMPID: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    position: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
});

module.exports = mongoose.model('Employee', employeeSchema);
