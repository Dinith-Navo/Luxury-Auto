const Feedback = require('../Model/FeedbackModel');

// Generate feedback ID with leading zeros
const generateFeedbackId = async () => {
    const lastFeedback = await Feedback.findOne().sort({ feedbackId: -1 }).limit(1);
    const lastId = lastFeedback ? parseInt(lastFeedback.feedbackId.replace('F', ''), 10) : 0;
    const newId = `F${(lastId + 1).toString().padStart(3, '0')}`; // Adjust padding as needed
    return newId;
};

// Create a new feedback
exports.createFeedback = async (req, res) => {
    try {
        const { customerId, movieId, rating, comment } = req.body;

        const feedbackId = await generateFeedbackId(); // Generate new feedback ID
        const newFeedback = new Feedback({ feedbackId, customerId, movieId, rating, comment });
        await newFeedback.save();

        res.status(201).json({ message: 'Feedback created successfully', feedback: newFeedback });
    } catch (error) {
        res.status(500).json({ message: 'Error creating feedback', error });
    }
};

// Get all feedbacks
exports.getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving feedbacks', error });
    }
};

// Get feedback by ID
exports.getFeedbackById = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving feedback', error });
    }
};

// Update feedback by ID
exports.updateFeedback = async (req, res) => {
    try {
        const { customerId, movieId, rating, comment } = req.body;
        const updatedFeedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { customerId, movieId, rating, comment },
            { new: true } // Return the updated feedback
        );

        if (!updatedFeedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        res.status(200).json({ message: 'Feedback updated successfully', feedback: updatedFeedback });
    } catch (error) {
        res.status(500).json({ message: 'Error updating feedback', error });
    }
};

// Delete feedback by ID
exports.deleteFeedback = async (req, res) => {
    try {
        const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!deletedFeedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting feedback', error });
    }
};
