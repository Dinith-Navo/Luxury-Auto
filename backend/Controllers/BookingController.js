const VehicleBooking = require('../Model/BookingModel');
const mongoose = require('mongoose');

// Generate Booking ID with leading zeros
const generateBookingId = async () => {
    const lastBooking = await VehicleBooking.findOne().sort({ bookingId: -1 }).limit(1);
    const lastId = lastBooking ? parseInt(lastBooking.bookingId.replace('B', ''), 10) : 0;
    const newId = `B${(lastId + 1).toString().padStart(3, '0')}`;
    return newId;
};

// Create a new Vehicle Booking
exports.createBooking = async (req, res) => {
    try {
        const { customerId, vehicleId, pickUpLocation, status, dateFrom, dateTo } = req.body;
        
        // Generate new Booking ID
        const bookingId = await generateBookingId();
        
        // Check if all required fields are present
        if (!customerId || !vehicleId || !pickUpLocation || !status || !dateFrom || !dateTo) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newBooking = new VehicleBooking({ bookingId, customerId, vehicleId, pickUpLocation, status, dateFrom, dateTo });
        await newBooking.save();

        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
};

// Get all Vehicle Bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await VehicleBooking.find();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving bookings', error: error.message });
    }
};

// Get a single Vehicle Booking by ID
exports.getBookingById = async (req, res) => {
    const id = req.params.id;

    try {
        const booking = await VehicleBooking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving booking', error: error.message });
    }
};

// Update a Vehicle Booking by ID
exports.updateBooking = async (req, res) => {
    const id = req.params.id;
    const { customerId, vehicleId, pickUpLocation, status, dateFrom, dateTo } = req.body;

    try {
        const updatedBooking = await VehicleBooking.findByIdAndUpdate(
            id,
            { customerId, vehicleId, pickUpLocation, status, dateFrom, dateTo },
            { new: true, runValidators: true } // Return the updated booking, validate inputs
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
    } catch (error) {
        res.status(500).json({ message: 'Error updating booking', error: error.message });
    }
};

// Delete a Vehicle Booking by ID
exports.deleteBooking = async (req, res) => {
    const id = req.params.id;

    // Convert ID to ObjectId if necessary
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Booking ID' });
    }

    try {
        const deletedBooking = await VehicleBooking.findByIdAndDelete(id);
        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting booking', error: error.message });
    }
};