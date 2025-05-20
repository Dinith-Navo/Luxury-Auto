const User = require('../Model/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');
const saltRounds = 10;

// Generate user ID with leading zeros
const generateUserId = async () => {
    const lastUser = await User.findOne().sort({ userId: -1 }).limit(1);
    const lastId = lastUser ? parseInt(lastUser.userId.slice(1), 10) : 0;
    const newId = (lastId + 1).toString().padStart(3, '0');
    return `U${newId}`;
};

// Login user
exports.loginUser = async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await User.findOne({ userName: name });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const { password: pwd, ...userData } = user.toObject();
        res.status(200).json({ success: true, token, user: userData });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.user.userId }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user profile', error: error.message });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const { userName, name, email, phone, type, password } = req.body;
        const updateData = { userName, name, email, phone, type };

        if (password) {
            updateData.password = await bcrypt.hash(password, saltRounds);
        }

        const updatedUser = await User.findOneAndUpdate(
            { userId: req.user.userId },
            updateData,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }
};

// Change user password
exports.changeUserPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findOne({ userId: req.user.userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }
        user.password = await bcrypt.hash(newPassword, saltRounds);
        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error changing password', error: error.message });
    }
};

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { userName, name, email, password, phone, type } = req.body;

        const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const userId = await generateUserId();
        const newUser = new User({ userId, userName, name, email, password: hashedPassword, phone, type });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error: error.message });
    }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
    try {
        const { userName, name, email, password, phone, type } = req.body;
        const updateData = { userName, name, email, phone, type };

        if (password) {
            updateData.password = await bcrypt.hash(password, saltRounds);
        }

        const updatedUser = await User.findOneAndUpdate(
            { userId: req.params.id },
            updateData,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ userId: req.params.id });
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};
exports.updateUserProfile = async (req, res) => {
    try {
        // ...

        const updatedUser = await User.findOneAndUpdate(
            { userId: req.user.userId },
            updateData,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user object in the AuthContext
        req.user = updatedUser;

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }
};