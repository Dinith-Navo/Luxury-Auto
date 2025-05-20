const Salary = require('../Model/SalaryModel');

// Generate salary ID with leading zeros
const generateSalaryID = async () => {
    const lastSalary = await Salary.findOne().sort({ salaryID: -1 }).limit(1);
    const lastId = lastSalary ? parseInt(lastSalary.salaryID.replace('S', ''), 10) : 0;
    const newId = `S${(lastId + 1).toString().padStart(3, '0')}`; // Adjust padding as needed
    return newId;
};

// Create a new salary record
exports.createSalary = async (req, res) => {
    try {
        const { EMPID, month, workdays, otRate, otHours } = req.body;
        const totalSalary = (workdays * 8 * otRate) + (otHours * otRate); // Example calculation

        const salaryID = await generateSalaryID(); // Generate new salary ID
        const newSalary = new Salary({ salaryID, EMPID, month, workdays, otRate, otHours, totalSalary });
        await newSalary.save();

        res.status(201).json({ message: 'Salary record created successfully', salary: newSalary });
    } catch (error) {
        res.status(500).json({ message: 'Error creating salary record', error: error.message });
    }
};

// Get all salary records
exports.getAllSalaries = async (req, res) => {
    try {
        const salaries = await Salary.find();
        res.status(200).json(salaries);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving salary records', error: error.message });
    }
};

// Get a salary record by ID
exports.getSalaryById = async (req, res) => {
    try {
        const salary = await Salary.findById(req.params.id);
        if (!salary) {
            return res.status(404).json({ message: 'Salary record not found' });
        }
        res.status(200).json(salary);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving salary record', error: error.message });
    }
};

// Update a salary record by ID
exports.updateSalary = async (req, res) => {
    try {
        const { EMPID, month, workdays, otRate, otHours } = req.body;
        const totalSalary = (workdays * 8 * otRate) + (otHours * otRate); // Example calculation

        const updatedSalary = await Salary.findByIdAndUpdate(
            req.params.id,
            { EMPID, month, workdays, otRate, otHours, totalSalary },
            { new: true } // Return the updated salary record
        );

        if (!updatedSalary) {
            return res.status(404).json({ message: 'Salary record not found' });
        }

        res.status(200).json({ message: 'Salary record updated successfully', salary: updatedSalary });
    } catch (error) {
        res.status(500).json({ message: 'Error updating salary record', error: error.message });
    }
};

// Delete a salary record by ID
exports.deleteSalary = async (req, res) => {
    try {
        const deletedSalary = await Salary.findByIdAndDelete(req.params.id);
        if (!deletedSalary) {
            return res.status(404).json({ message: 'Salary record not found' });
        }

        res.status(200).json({ message: 'Salary record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting salary record', error: error.message });
    }
};
