const Payment = require('../Model/PaymentModel'); // Assuming you have a Payment model defined
const mongoose = require('mongoose');

// Function to generate a new Payment ID
const generatePaymentId = async () => {
    try {
        const lastPayment = await Payment.findOne().sort({ PID: -1 });
        const lastId = lastPayment ? parseInt(lastPayment.PID.replace('P', ''), 10) : 0; // Corrected to PID
        const newId = `P${(lastId + 1).toString().padStart(3, '0')}`; // Generates ID with 'P' prefix
        return newId;
    } catch (error) {
        throw new Error('Error generating Payment ID');
    }
};

// Create a new payment
exports.createPayment = async (req, res) => {
    console.log('Received payment data:', req.body); // Log the incoming data

    try {
        const { amount, method, status, transactionDate } = req.body;

        // Validate required fields
        if (!amount) {
            return res.status(400).json({ message: 'Payment amount is required' });
        }

        // Validate and parse the transactionDate
        const parsedDate = transactionDate ? new Date(transactionDate) : Date.now();
        if (isNaN(parsedDate)) {
            return res.status(400).json({ message: 'Invalid transaction date' });
        }

        const PID = await generatePaymentId(); // Generate new Payment ID

        const newPayment = new Payment({
            PID,
            amount,
            method,
            status,
            transactionDate: parsedDate,
        });

        await newPayment.save();
        res.status(201).json({ message: 'Payment created successfully', payment: newPayment });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ message: 'Validation Error', error: error.errors });
        } else {
            console.error('Error creating payment:', error);
            res.status(500).json({ message: 'Error creating payment', error: error.message });
        }
    }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find();
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error retrieving payments:', error);
        res.status(500).json({ message: 'Error retrieving payments', error: error.message });
    }
};

// Get a single payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Payment ID format' });
        }

        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        console.error('Error retrieving payment:', error);
        res.status(500).json({ message: 'Error retrieving payment', error: error.message });
    }
};

// Update a payment by ID
exports.updatePayment = async (req, res) => {
    try {
        const { amount, method, status, transactionDate } = req.body;
        
        // Filter out undefined values before updating
        const updateData = {};
        if (amount !== undefined) updateData.amount = amount;
        if (method !== undefined) updateData.method = method;
        if (status !== undefined) updateData.status = status;
        if (transactionDate !== undefined) updateData.transactionDate = new Date(transactionDate);

        const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json({ message: 'Payment updated successfully', payment: updatedPayment });
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).json({ message: 'Error updating payment', error: error.message });
    }
};

// Delete a payment by ID
exports.deletePayment = async (req, res) => {
    try {
        const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
        if (!deletedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        console.error('Error deleting payment:', error);
        res.status(500).json({ message: 'Error deleting payment', error: error.message });
    }
};
