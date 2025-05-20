const Vehicle = require('../Model/VehicleModel');

// Generate vehicle ID with leading zeros
const generateVehicleId = async () => {
    const lastVehicle = await Vehicle.findOne().sort({ vehicleId: -1 }).limit(1);
    
    // If no vehicle exists, start the vehicleId from "V001"
    const lastId = lastVehicle ? parseInt(lastVehicle.vehicleId.slice(1), 10) : 0;
    const newId = (lastId + 1).toString().padStart(3, '0');  // Generate new vehicle ID with 3 digits
    return `V${newId}`;  // Return the ID in the format "V001", "V002", etc.
};


// Create a new vehicle
exports.createVehicle = async (req, res) => {
    try {
        const { vehicleId,image, name, type, fuel, seats, transmission, price, status, location, from, to } = req.body;

        console.log('Received data:', req.body); // Debugging line

        // const vehicleId = await generateVehicleId();
        const newVehicle = new Vehicle({
            vehicleId,
            image,  // Save the URL as is
            name,
            type,
            fuel,
            seats,
            transmission,
            price,
            status,
            location,
            from,
            to
        });

        await newVehicle.save();
        res.status(201).json({ message: 'Vehicle created successfully', vehicle: newVehicle });
    } catch (error) {
        res.status(500).json({ message: 'Error creating vehicle', error: error.message });
        console.error('Error creating vehicle:', error); // Debugging line
    }
};


// Get all vehicles
exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving vehicles', error: error.message });
    }
};

// Get a single vehicle by ID
exports.getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({ vehicleId: req.params.id });
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving vehicle', error: error.message });
    }
};

// Update a vehicle by ID
exports.updateVehicle = async (req, res) => {
    try {
        const { image, name, type, fuel, seats, transmission, price, status, location, from, to } = req.body;
        const updateData = { image, name, type, fuel, seats, transmission, price, status, location, from, to };

        const updatedVehicle = await Vehicle.findOneAndUpdate(
            { vehicleId: req.params.id },
            updateData,
            { new: true }
        );

        if (!updatedVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.status(200).json({ message: 'Vehicle updated successfully', vehicle: updatedVehicle });
    } catch (error) {
        res.status(500).json({ message: 'Error updating vehicle', error: error.message });
    }
};

// Delete a vehicle by ID
exports.deleteVehicle = async (req, res) => {
    try {
        const deletedVehicle = await Vehicle.findOneAndDelete({ vehicleId: req.params.id });
        if (!deletedVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting vehicle', error: error.message });
    }
};
