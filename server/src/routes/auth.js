const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateStudentRegistration } = require('../middleware/validation');
const upload = require('../middleware/upload');
const { authLimiter } = require('../middleware/rateLimit');

// Student registration
router.post('/register', authLimiter, upload.single('photo'), validateStudentRegistration, authController.register);

// Login
router.post('/login', authLimiter, authController.login);

// Logout
router.post('/logout', authController.logout);

// Verify email
router.get('/verify-email', authController.verifyEmail);

// Resend verification email
router.post('/resend-verification', authLimiter, authController.resendVerification);

// Check authentication status
router.get('/check', authController.checkAuth);

module.exports = router;