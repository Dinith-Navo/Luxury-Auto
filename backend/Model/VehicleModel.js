const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  vehicleId: { type: String, required: false},
  image: { type: String },
  name: { type: String, required: false },
  type: { type: String, required: false},
  fuel: { type: String, required: false },
  seats: { type: Number, required: false }, // Minimum 1 seat
  transmission: { type: String, required: false},
  price: { type: Number, required: false }, // Price should be positive
  status: { type: String, required: false},
  location: { type: String, required: false },
  from: { type: Date, required: false },
  to: { type: Date, required: false },
});

module.exports = mongoose.model('VehicleSchema', VehicleSchema);