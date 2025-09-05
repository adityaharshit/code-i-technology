const isEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isMobile = (mobile) => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

const isStrongPassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return strongPasswordRegex.test(password);
};

const validateAddress = (address) => {
  if (!address || typeof address !== 'object') return false;
  
  const requiredFields = ['flatHouseNo', 'street', 'po', 'ps', 'district', 'state', 'pincode'];
  return requiredFields.every(field => address[field] && address[field].trim() !== '');
};

module.exports = {
  isEmail,
  isMobile,
  isStrongPassword,
  validateAddress
};