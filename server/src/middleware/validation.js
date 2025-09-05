const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation for registration
const validateRegistration = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

// Validation for login
const validateLogin = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

// Validation for profile update
const validateUpdateProfile = [
  body('studentMobile').optional().isMobilePhone().withMessage('Valid mobile number is required'),
  body('parentMobile').optional().isMobilePhone().withMessage('Valid parent mobile number is required'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  handleValidationErrors
];

// Validation for course creation
const validateCourse = [
  body('title').notEmpty().withMessage('Course title is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('feePerMonth').isFloat({ min: 0 }).withMessage('Fee must be a positive number'),
  handleValidationErrors
];

// Validation for payment
const validatePayment = [
  body('courseId').isInt({ min: 1 }).withMessage('Valid course ID is required'),
  body('months').isInt({ min: 1 }).withMessage('Months must be a positive integer'),
  body('modeOfPayment').isIn(['online', 'offline']).withMessage('Mode of payment must be online or offline'),
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateUpdateProfile,
  validateCourse,
  validatePayment,
  handleValidationErrors
};