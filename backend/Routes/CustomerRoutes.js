const express = require('express');
const router = express.Router();
const CustomerController = require('../Controllers/CustomerController');

// Routes
router.post('/', CustomerController.createCustomer);
router.get('/', CustomerController.getAllCustomers);
router.get('/:id', CustomerController.getCustomerById);
router.put('/:id', CustomerController.updateCustomer);
router.delete('/:id', CustomerController.deleteCustomer);

module.exports = router;
