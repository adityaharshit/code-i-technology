// /server/src/routes/contact.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

// Validation middleware for the contact form
const validateContactForm = [
  body('name').notEmpty().withMessage('Name is required').trim().escape(),
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('subject').notEmpty().withMessage('Subject is required').trim().escape(),
  body('message').notEmpty().withMessage('Message is required').trim().escape(),
  handleValidationErrors
];

// Route to handle contact form submission
router.post('/', validateContactForm, contactController.sendContactEmail);

module.exports = router;
