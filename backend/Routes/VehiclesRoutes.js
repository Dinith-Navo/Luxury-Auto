const express = require('express');
const router = express.Router();
const VehicleController = require('../Controllers/VehicleController');
const upload = require('../middleware/multer');

// Routes

router.post('/', VehicleController.createVehicle);

router.get('/', VehicleController.getAllVehicles);

router.get('/:id', VehicleController.getVehicleById);

router.put('/:id', VehicleController.updateVehicle);

router.delete('/:id', VehicleController.deleteVehicle);

module.exports = router;