const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { validateUpdateProfile } = require('../middleware/validation');

// Get current user profile
router.get('/profile', requireAuth, userController.getProfile);

// Update user profile
router.put('/profile', requireAuth, validateUpdateProfile, userController.updateProfile);

// Get user by ID (admin only)
router.get('/:id', requireAdmin, userController.getUserById);

module.exports = router;