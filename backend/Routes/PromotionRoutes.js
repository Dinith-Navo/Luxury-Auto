const express = require('express');
const router = express.Router();
const PromotionController = require('../Controllers/PromotionController');

// Make sure the controller methods are correctly defined and imported
router.get('/', PromotionController.getPromotions);
router.post('/', PromotionController.createPromotion);
router.get('/:id', PromotionController.getPromotionById);
router.put('/:id', PromotionController.updatePromotion);
router.delete('/:id', PromotionController.deletePromotion);

module.exports = router;
