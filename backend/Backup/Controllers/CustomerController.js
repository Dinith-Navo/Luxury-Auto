const Customer = require('../Model/CustomerModel');

// Generate customer ID with leading zeros
const generateCustomerId = async () => {
    const lastCustomer = await Customer.findOne().sort({ CustomerId: -1 }).limit(1);
    const lastId = lastCustomer ? parseInt(lastCustomer.CustomerId.replace('C', ''), 10) : 0;
    const newId = `C${(lastId + 1).toString().padStart(3, '0')}`; // Adjust padding as needed
    return newId;
};

// Create a new customer
exports.createCustomer = async (req, res) => {
    try {
        const { name, gender, phone } = req.body;
        
        const CustomerId = await generateCustomerId(); // Generate new customer ID
        const newCustomer = new Customer({ CustomerId, name, gender, phone });
        await newCustomer.save();
        
        res.status(201).json({ message: 'Customer created successfully', customer: newCustomer });
    } catch (error) {
        res.status(500).json({ message: 'Error creating customer', error: error.message });
    }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving customers', error: error.message });
    }
};

// Get a single customer by ID
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving customer', error: error.message });
    }
};

// Update a customer by ID
exports.updateCustomer = async (req, res) => {
    try {
        const { name, gender, phone } = req.body;
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            { name, gender, phone },
            { new: true } // Return the updated customer
        );
        
        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        
        res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
    } catch (error) {
        res.status(500).json({ message: 'Error updating customer', error: error.message });
    }
};

// Delete a customer by ID
exports.deleteCustomer = async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        if (!deletedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting customer', error: error.message });
    }
};
