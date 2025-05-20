const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
  feedbackId: {
    type: String,
    required: true,
    unique: true,
  },
  customerId: {
    type: String,
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5, // Assuming ratings are from 1 to 5 stars
  },
  comment: {
    type: String,
    default: '',
  }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
