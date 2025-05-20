const express = require('express');
const router = express.Router();
const SalaryController = require('../Controllers/SalaryController');

// Routes for salary operations
router.post('/', SalaryController.createSalary);
router.get('/', SalaryController.getAllSalaries);
router.get(':id', SalaryController.getSalaryById);
router.put('/:id', SalaryController.updateSalary);
router.delete('/:id', SalaryController.deleteSalary);

module.exports = router;
