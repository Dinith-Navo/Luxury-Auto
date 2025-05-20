const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    salaryID: {
        type: String,
        required: true,
        unique: true
    },
    EMPID: {
        type: String,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    workdays: {
        type: Number,
        required: true
    },
    otRate: {
        type: Number,
        required: true
    },
    otHours: {
        type: Number,
        required: true
    },
    totalSalary: {
        type: Number,
        required: true
    }
});

const Salary = mongoose.model('Salary', salarySchema);

module.exports = Salary;
