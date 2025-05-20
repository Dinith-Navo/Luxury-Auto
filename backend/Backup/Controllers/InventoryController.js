const Inventory = require('../Model/InventoryModel'); // Adjust the path as necessary
const mongoose = require('mongoose');

// Generate a new Inventory ID
const generateInventoryID = async () => {
    const lastInventory = await Inventory.findOne().sort({ InvID: -1 }).limit(1);
    const lastId = lastInventory ? parseInt(lastInventory.InvID.replace('I', ''), 10) : 0;
    const newId = `I${(lastId + 1).toString().padStart(3, '0')}`; // Adjust padding as needed
    return newId;
};

// Create a new inventory item
exports.createInventory = async (req, res) => {
    try {
        const { ItemName, type, OrderID, Cost, Date, Note } = req.body;

        // Generate a new Inventory ID
        const InvID = await generateInventoryID();

        const newInventory = new Inventory({
            InvID,
            ItemName,
            type,
            OrderID,
            Cost,
            Date,
            Note
        });

        await newInventory.save();

        res.status(201).json({ message: 'Inventory item created successfully', inventory: newInventory });
    } catch (error) {
        res.status(500).json({ message: 'Error creating inventory item', error });
    }
};

// Get all inventory items
exports.getAllInventories = async (req, res) => {
    try {
        const inventories = await Inventory.find();
        res.status(200).json(inventories);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving inventory items', error });
    }
};

// Get a single inventory item by ID
exports.getInventoryById = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id);
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }
        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving inventory item', error });
    }
};

// Update an inventory item by ID
exports.updateInventory = async (req, res) => {
    try {
        const { ItemName, type, OrderID, Cost, Date, Note } = req.body;

        const updatedInventory = await Inventory.findByIdAndUpdate(
            req.params.id,
            { ItemName, type, OrderID, Cost, Date, Note },
            { new: true } // Return the updated inventory item
        );

        if (!updatedInventory) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        res.status(200).json({ message: 'Inventory item updated successfully', inventory: updatedInventory });
    } catch (error) {
        res.status(500).json({ message: 'Error updating inventory item', error });
    }
};

// Delete an inventory item by ID
exports.deleteInventory = async (req, res) => {
    try {
        const deletedInventory = await Inventory.findByIdAndDelete(req.params.id);
        if (!deletedInventory) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        res.status(200).json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting inventory item', error });
    }
};
