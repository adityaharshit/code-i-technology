// server/src/middleware/validation.js
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
  body('fatherName').notEmpty().withMessage("Father's name is required"),
  body('email').isEmail().withMessage('Valid email is required'),
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9._]+$/)
    .withMessage('Username can only contain letters, numbers, periods, and underscores'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('studentMobile')
    .isLength({ min: 10, max: 10 }).withMessage('Student mobile must be 10 digits')
    .isMobilePhone('en-IN').withMessage('Valid student mobile number is required'),
  body('parentMobile')
    .isLength({ min: 10, max: 10 }).withMessage('Parent mobile must be 10 digits')
    .isMobilePhone('en-IN').withMessage('Valid parent mobile number is required'),
  body('dob').isISO8601().withMessage('Valid date of birth is required'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),
  // Address validation can remain complex, as it handles JSON
  body('permanentAddress').custom((value) => {
    try {
      const address = typeof value === 'string' ? JSON.parse(value) : value;
      if (!address.flatHouseNo || !address.street || !address.po || !address.ps || 
          !address.district || !address.state || !address.pinCode) {
        throw new Error('All permanent address fields are required');
      }
      return true;
    } catch (error) {
      throw new Error('Invalid permanent address format');
    }
  }),
  body('localAddress').custom((value) => {
    try {
      const address = typeof value === 'string' ? JSON.parse(value) : value;
      if (!address.flatHouseNo || !address.street || !address.po || !address.ps || 
          !address.district || !address.state || !address.pinCode) {
        throw new Error('All local address fields are required');
      }
      return true;
    } catch (error) {
      throw new Error('Invalid local address format');
    }
  }),
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
