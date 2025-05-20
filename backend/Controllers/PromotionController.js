const Promotion = require('../Model/PromotionModel');

// Generate promotion ID with leading zeros
const generatePromotionId = async () => {
    const lastPromotion = await Promotion.findOne().sort({ PROMOID: -1 }).limit(1);
    const lastId = lastPromotion ? parseInt(lastPromotion.PROMOID.replace('P', ''), 10) : 0;
    const newId = `P${(lastId + 1).toString().padStart(3, '0')}`; // Adjust padding as needed
    return newId;
};

// Create a new promotion
exports.createPromotion = async (req, res) => {
    try {
        const { title, description, discountPercentage, validFrom, validTo, paymentMethods } = req.body;

        const PROMOID = await generatePromotionId(); // Generate new promotion ID
        const newPromotion = new Promotion({
            PROMOID,
            title,
            description,
            discountPercentage,
            validFrom,
            validTo,
            paymentMethods // Include payment methods
        });
        await newPromotion.save();

        res.status(201).json({ message: 'Promotion created successfully', promotion: newPromotion });
    } catch (error) {
        res.status(500).json({ message: 'Error creating promotion', error: error.message });
    }
};

// Get all promotions
exports.getPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.find();
        res.status(200).json(promotions);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving promotions', error: error.message });
    }
};

// Get a promotion by ID
exports.getPromotionById = async (req, res) => {
    try {
        const promotion = await Promotion.findById(req.params.id);
        if (promotion) {
            res.status(200).json(promotion);
        } else {
            res.status(404).json({ message: 'Promotion not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving promotion', error: error.message });
    }
};

// Update a promotion by ID
exports.updatePromotion = async (req, res) => {
    try {
        const { title, description, discountPercentage, validFrom, validTo, paymentMethods } = req.body;
        const updatedPromotion = await Promotion.findByIdAndUpdate(
            req.params.id,
            { title, description, discountPercentage, validFrom, validTo, paymentMethods }, // Include payment methods
            { new: true } // Return the updated promotion
        );

        if (updatedPromotion) {
            res.status(200).json({ message: 'Promotion updated successfully', promotion: updatedPromotion });
        } else {
            res.status(404).json({ message: 'Promotion not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating promotion', error: error.message });
    }
};

// Delete a promotion by ID
exports.deletePromotion = async (req, res) => {
    try {
        const deletedPromotion = await Promotion.findByIdAndDelete(req.params.id);
        if (deletedPromotion) {
            res.status(200).json({ message: 'Promotion deleted successfully' });
        } else {
            res.status(404).json({ message: 'Promotion not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting promotion', error: error.message });
    }
};
