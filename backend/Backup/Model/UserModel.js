const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,  // Ensures the phone number is exactly 10 digits long
  },
  type: {
    type: String,
    required: true,
    enum: ['admin', 'user'],
    default: 'user'
  }
});

module.exports = mongoose.model('User', UserSchema);
