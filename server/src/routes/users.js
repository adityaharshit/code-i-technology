const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser } = require('../middleware/auth');
const { validateUpdateProfile } = require('../middleware/validation');

// Get current user profile
router.get('/profile', authenticateUser, userController.getProfile);

// Update user profile
router.put('/profile', authenticateUser, validateUpdateProfile, userController.updateProfile);

// Get user by ID (admin only)
router.get('/:id', authenticateUser, userController.getUserById);

module.exports = router;