// /server/src/routes/index.js
const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const courseRoutes = require('./courses');
const paymentRoutes = require('./payments');
const adminRoutes = require('./admin');
const userRoutes = require('./users');
const contactRoutes = require('./contact');

// Use routes
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);
router.use('/contact', contactRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running!' });
});

module.exports = router;
