const express = require('express');
const router = express.Router();
const EmployeeController = require('../Controllers/EmployeeController');


router.post('/', EmployeeController.createEmployee);
router.get('/', EmployeeController.getEmployees);
router.get('/:id', EmployeeController.getEmployeeById);
router.put('/:id', EmployeeController.updateEmployee);
router.delete('/:id', EmployeeController.deleteEmployee);

module.exports = router;
