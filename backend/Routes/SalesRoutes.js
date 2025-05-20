const express = require('express');
const router = express.Router();
const SalesController = require('../Controllers/SalesController');

router.post('/', SalesController.createSale);
router.get('/', SalesController.getAllSales);
router.get('/:id', SalesController.getSaleById);
router.put('/:id', SalesController.updateSale);
router.delete('/:id', SalesController.deleteSale);
router.post("/sales/batch", SalesController.createSalesBatch);


module.exports = router;
