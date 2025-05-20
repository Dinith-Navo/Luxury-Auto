const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/UserController');
const auth = require('../middleware/auth');

// Define routes
router.post('/register', UserController.createUser);
router.get('/', UserController.getAllUsers);
router.get('/:id',  UserController.getUserById);
router.put('/:id',  UserController.updateUser);
router.delete('/:id',  UserController.deleteUser);
router.get('/userprofile', UserController.getUserProfile);

module.exports = router;
