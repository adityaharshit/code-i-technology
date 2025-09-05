export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateMobile = (mobile) => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const validatePincode = (pincode) => {
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(pincode);
};

export const validateRegistration = (formData) => {
  const errors = {};

  // Required fields validation
  if (!formData.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  }

  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }

  if (!formData.username?.trim()) {
    errors.username = 'Username is required';
  } else if (!validateUsername(formData.username)) {
    errors.username = 'Username must be 3-20 characters (letters, numbers, underscores only)';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (formData.studentMobile && !validateMobile(formData.studentMobile)) {
    errors.studentMobile = 'Invalid mobile number';
  }

  if (formData.parentMobile && !validateMobile(formData.parentMobile)) {
    errors.parentMobile = 'Invalid mobile number';
  }

  // Address validation
  if (formData.permanentAddress) {
    const { flatNo, street, po, ps, district, state, pincode } = formData.permanentAddress;
    
    if (!flatNo?.trim()) errors['permanentAddress.flatNo'] = 'Flat/House No is required';
    if (!street?.trim()) errors['permanentAddress.street'] = 'Street is required';
    if (!po?.trim()) errors['permanentAddress.po'] = 'PO is required';
    if (!ps?.trim()) errors['permanentAddress.ps'] = 'PS is required';
    if (!district) errors['permanentAddress.district'] = 'District is required';
    if (!state) errors['permanentAddress.state'] = 'State is required';
    if (!pincode) {
      errors['permanentAddress.pincode'] = 'Pincode is required';
    } else if (!validatePincode(pincode)) {
      errors['permanentAddress.pincode'] = 'Invalid pincode';
    }
  }

  return errors;
};

export const validateLogin = (credentials) => {
  const errors = {};

  if (!credentials.username?.trim()) {
    errors.username = 'Username or email is required';
  }

  if (!credentials.password) {
    errors.password = 'Password is required';
  }

  return errors;
};

export const validateCourse = (courseData) => {
  const errors = {};

  if (!courseData.title?.trim()) {
    errors.title = 'Course title is required';
  }

  if (!courseData.description?.trim()) {
    errors.description = 'Course description is required';
  }

  if (!courseData.duration || courseData.duration <= 0) {
    errors.duration = 'Valid duration is required';
  }

  if (!courseData.feePerMonth || courseData.feePerMonth <= 0) {
    errors.feePerMonth = 'Valid fee amount is required';
  }

  if (!courseData.status) {
    errors.status = 'Course status is required';
  }

  return errors;
};

export const validatePayment = (paymentData) => {
  const errors = {};

  if (!paymentData.courseId) {
    errors.courseId = 'Course selection is required';
  }

  if (!paymentData.months || paymentData.months <= 0) {
    errors.months = 'Valid number of months is required';
  }

  if (!paymentData.modeOfPayment) {
    errors.modeOfPayment = 'Payment mode is required';
  }

  if (paymentData.modeOfPayment === 'online' && !paymentData.paymentProofUrl) {
    errors.paymentProofUrl = 'Payment proof is required for online payments';
  }

  return errors;
};