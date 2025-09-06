// Re-export shared validators for server-side use
const {
  validateEmail,
  validateMobile,
  validatePassword,
  validateStrongPassword,
  validateUsername,
  validatePincode,
  validateAddress,
  validateRegistration,
  validateLogin,
  validateCourse,
  validatePayment
} = require('../../shared/validators.js');

// Keep backward compatibility with old function names
const isEmail = validateEmail;
const isMobile = validateMobile;
const isStrongPassword = validateStrongPassword;

module.exports = {
  // New standardized names
  validateEmail,
  validateMobile,
  validatePassword,
  validateStrongPassword,
  validateUsername,
  validatePincode,
  validateAddress,
  validateRegistration,
  validateLogin,
  validateCourse,
  validatePayment,
  // Backward compatibility
  isEmail,
  isMobile,
  isStrongPassword
};