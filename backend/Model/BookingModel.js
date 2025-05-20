const mongoose = require('mongoose');

const vehicleBookingSchema = new mongoose.Schema({
    bookingId: { type: String, required: true, unique: true },
    customerId: { type: String, required: false,default: 'Unknown' },
    vehicleId: { type: String, required: true },
    pickUpLocation: { type: String, required: false },
    status: { type: String, required: true, default: 'pending' },
    dateFrom: { type: Date, required: true },
    dateTo: { type: Date, required: true }
});

module.exports = mongoose.model('Vehicle-Booking', vehicleBookingSchema);