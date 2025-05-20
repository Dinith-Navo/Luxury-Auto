const express = require('express');
const router = express.Router();
const FeedbackController = require('../Controllers/FeedbackController');

// Routes
router.post('/', FeedbackController.createFeedback);
router.get('/', FeedbackController.getAllFeedbacks);
router.get('/:id', FeedbackController.getFeedbackById);
router.put('/:id', FeedbackController.updateFeedback);
router.delete('/:id', FeedbackController.deleteFeedback);

module.exports = router;
