/**
 * Shared validation functions for client and server.
 */

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateMobile = (mobile) => {
  if (!mobile || typeof mobile !== 'string') return false;
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

export const validatePassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') return false;
  // 3-20 characters, letters, numbers, underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const validatePincode = (pincode) => {
  if (!pincode || typeof pincode !== 'string') return false;
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(pincode);
};

export const validateAddress = (address) => {
  if (!address || typeof address !== 'object') return false;
  const requiredFields = ['flatHouseNo', 'street', 'po', 'ps', 'district', 'state', 'pincode'];
  return requiredFields.every(field => address[field] && String(address[field]).trim() !== '');
};
