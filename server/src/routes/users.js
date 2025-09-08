const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, requireAdmin, requireStudent } = require('../middleware/auth');
const { validateUpdateProfile } = require('../middleware/validation');

// Get current user profile
router.get('/profile', requireAuth, userController.getProfile);

// Update user profile
router.put('/profile', requireAuth, validateUpdateProfile, userController.updateProfile);

// Get dashboard stats for the logged-in student
router.get('/dashboard-stats', requireAuth, requireStudent, userController.getDashboardStats);

// Get user by ID (admin only)
router.get('/:id', requireAdmin, userController.getUserById);

module.exports = router;
