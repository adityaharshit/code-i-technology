const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

// Admin dashboard stats
router.get('/dashboard', requireAdmin, adminController.getDashboardStats);

// Student management
router.get('/students', requireAdmin, adminController.getAllStudents);
router.delete('/students/:id', requireAdmin, adminController.deleteStudent);

// Course management (handled in courses.js but protected here)
// Payment management (handled in payments.js but protected here)

module.exports = router;