const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  CustomerId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other'],
  },
  phone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,  // Ensures the phone number is exactly 10 digits long
  },
});

module.exports = mongoose.model('Customer', CustomerSchema);
