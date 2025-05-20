const express = require('express');
const router = express.Router();
const vehicleBookingController = require('../Controllers/BookingController');

// Vehicle Booking routes
router.post('/', vehicleBookingController.createBooking); // Create a new vehicle booking
router.get('/', vehicleBookingController.getAllBookings); // Get all vehicle bookings
router.get('/:id', vehicleBookingController.getBookingById); // Get vehicle booking by ID
router.put('/:id', vehicleBookingController.updateBooking); // Update vehicle booking by ID
router.delete('/:id', vehicleBookingController.deleteBooking); // Delete vehicle booking by ID

module.exports = router;
