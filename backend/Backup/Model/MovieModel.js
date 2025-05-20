const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  MID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  rate: { type: Number, required: true },
  status: { type: String, required: true },
  image: { type: String }, // Image URL or path
  description: { type: String }
});

module.exports = mongoose.model('Movie', MovieSchema);
