const User = require('../Model/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

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
