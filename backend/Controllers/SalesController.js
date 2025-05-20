const VehicleSale = require('../Model/SalesModel');
const mongoose = require('mongoose');

// Generate Sale ID with leading zeros
const generateSaleId = async () => {
    const lastSale = await VehicleSale.findOne().sort({ saleId: -1 }).limit(1);
    const lastId = lastSale ? parseInt(lastSale.saleId.replace('R', ''), 10) : 0;
    const newId = `R${(lastId + 1).toString().padStart(3, '0')}`;
    return newId;
};

exports.createSalesBatch = async (req, res) => {
  const salesList = req.body;
  if (!Array.isArray(salesList)) {
    return res.status(400).json({ message: 'Expected an array of sales' });
  }

  const created = [];
  const skipped = [];

  for (const sale of salesList) {
    const {  vehicleId, rentalPeriod, totalAmount, paymentStatus } = sale;

    // Ensure all required fields are provided
    if ( !vehicleId || !rentalPeriod || !totalAmount || !paymentStatus) {
      skipped.push({ reason: 'Missing required fields', sale });
      continue;
    }

    const exists = await VehicleSale.findOne({  vehicleId, rentalPeriod, totalAmount });
    if (exists) {
      skipped.push({ reason: 'Duplicate sale', sale });
      continue;
    }

    const saleId = await generateSaleId();
    const newSale = new VehicleSale({
      saleId,
      
      vehicleId,
      rentalPeriod,
      totalAmount,
      paymentStatus
    });

    await newSale.save();
    created.push(newSale);
  }

  res.status(207).json({
    message: 'Batch processed',
    createdCount: created.length,
    skippedCount: skipped.length,
    created,
    skipped,
  });
};

// Create a new Vehicle Sale
exports.createSale = async (req, res) => {
    try {
        const {  vehicleId, rentalPeriod, totalAmount, paymentStatus } = req.body;
        
        // Generate new Sale ID
        const saleId = await generateSaleId();
        
        // Check if all required fields are present
        if ( !vehicleId || !rentalPeriod || !totalAmount || !paymentStatus) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newSale = new VehicleSale({ 
            saleId, 
             
            vehicleId, 
            rentalPeriod, 
            totalAmount, 
            paymentStatus
        });

        await newSale.save();

        res.status(201).json({ message: 'Sale created successfully', sale: newSale });
    } catch (error) {
        res.status(500).json({ message: 'Error creating sale', error: error.message });
    }
};

// Get all Vehicle Sales
exports.getAllSales = async (req, res) => {
    try {
        const sales = await VehicleSale.find();
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving sales', error: error.message });
    }
};

// Get a single Vehicle Sale by ID
exports.getSaleById = async (req, res) => {
    const id = req.params.id;

    try {
        const sale = await VehicleSale.findById(id);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        res.status(200).json(sale);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving sale', error: error.message });
    }
};

// Update a Vehicle Sale by ID
exports.updateSale = async (req, res) => {
    const id = req.params.id;
    const {  vehicleId, rentalPeriod, totalAmount, paymentStatus } = req.body;

    try {
        const updatedSale = await VehicleSale.findByIdAndUpdate(
            id,
            {  vehicleId, rentalPeriod, totalAmount, paymentStatus },
            { new: true, runValidators: true } // Return the updated sale, validate inputs
        );

        if (!updatedSale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        res.status(200).json({ message: 'Sale updated successfully', sale: updatedSale });
    } catch (error) {
        res.status(500).json({ message: 'Error updating sale', error: error.message });
    }
};

// Delete a Vehicle Sale by ID
exports.deleteSale = async (req, res) => {
    const id = req.params.id;

    // Convert ID to ObjectId if necessary
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Sale ID' });
    }

    try {
        const deletedSale = await VehicleSale.findByIdAndDelete(id);
        if (!deletedSale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting sale', error: error.message });
    }
};
