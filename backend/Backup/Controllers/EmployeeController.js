const Employee = require('../Model/EmployeeModel');

// Generate employee ID with leading zeros
const generateEmployeeId = async () => {
    const lastEmployee = await Employee.findOne().sort({ EMPID: -1 }).limit(1);
    const lastId = lastEmployee ? parseInt(lastEmployee.EMPID.replace('E', ''), 10) : 0;
    const newId = `E${(lastId + 1).toString().padStart(3, '0')}`; // Adjust padding as needed
    return newId;
};

// Create a new employee
exports.createEmployee = async (req, res) => {
    try {
        const { name, email, position, phone, address } = req.body;

        const EMPID = await generateEmployeeId(); // Generate new employee ID
        const newEmployee = new Employee({ EMPID, name, email, position, phone, address });
        await newEmployee.save();

        res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
    } catch (error) {
        res.status(500).json({ message: 'Error creating employee', error: error.message });
    }
};

// Get all employees
exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving employees', error: error.message });
    }
};

// Get an employee by ID
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (employee) {
            res.status(200).json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving employee', error: error.message });
    }
};

// Update an employee by ID
exports.updateEmployee = async (req, res) => {
    try {
        const { name, email, position, phone, address } = req.body;
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            { name, email, position, phone, address },
            { new: true } // Return the updated employee
        );

        if (updatedEmployee) {
            res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee', error: error.message });
    }
};

// Delete an employee by ID
exports.deleteEmployee = async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (deletedEmployee) {
            res.status(200).json({ message: 'Employee deleted successfully' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error: error.message });
    }
};
