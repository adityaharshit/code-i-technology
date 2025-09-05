const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

// Admin dashboard stats
router.get('/dashboard', requireAdmin, adminController.getDashboardStats);

// User management
router.get('/users', requireAdmin, adminController.getAllUsers);
router.delete('/users/:id', requireAdmin, adminController.deleteUser);

// Course management (handled in courses.js but protected here)
// Payment management (handled in payments.js but protected here)

module.exports = router;