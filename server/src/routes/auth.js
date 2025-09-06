const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation'); // Assuming you have these
const upload = require('../middleware/upload');
const { authLimiter } = require('../middleware/rateLimit');

// Student registration
router.post('/register', authLimiter, upload.single('photo'), validateRegistration, authController.register);


// Check if username is available
router.post('/check-username', authController.checkUsername);

// Login for both students and admins
router.post('/login', authLimiter, validateLogin, authController.login);

// Logout
router.post('/logout', authController.logout);

// Verify email via token
router.post('/verify-email', authController.verifyEmail);

// Get current user's basic info for session check
router.get('/me', authController.getCurrentUser); // ADDED THIS ROUTE

module.exports = router;
