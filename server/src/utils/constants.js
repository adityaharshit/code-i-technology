// Re-export shared constants for server-side use
const {
  COURSE_STATUS,
  PAYMENT_STATUS,
  PAYMENT_MODES,
  DISCOUNT_PERCENTAGE
} = require('../../shared/constants.js');

module.exports = {
  COURSE_STATUS,
  PAYMENT_STATUS,
  PAYMENT_MODE: PAYMENT_MODES, // Keep backward compatibility
  DISCOUNT_PERCENTAGE
};