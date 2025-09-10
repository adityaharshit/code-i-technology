/**
 * Shared constants for client and server.
 */

export const APP_NAME = 'Code i Technology';
export const APP_VERSION = '1.0.0';

export const COURSE_STATUS = {
  UPCOMING: 'upcoming',
  LIVE: 'live',
  COMPLETED: 'completed'
};

export const PAYMENT_STATUS = {
  PENDING_APPROVAL: 'pending approval',
  PAID: 'paid',
  REJECTED: 'rejected'
};

export const PAYMENT_MODES = {
  ONLINE: 'online',
  OFFLINE: 'offline'
};

export const USER_ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin'
};

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
];

export const BLOOD_GROUP_OPTIONS = [
  { value: 'A+', label: 'A+' }, { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' }, { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' }, { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' }, { value: 'O-', label: 'O-' }
];

export const QUALIFICATION_OPTIONS = [
  { value: 'high_school', label: 'High School' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'bachelor', label: "Bachelor's Degree" },
  { value: 'master', label: "Master's Degree" },
  { value: 'phd', label: 'PhD' },
  { value: 'other', label: 'Other' }
];

export const OCCUPATION_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'employed', label: 'Employed' },
  { value: 'self_employed', label: 'Self Employed' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'other', label: 'Other' }
];

export const DISCOUNT_PERCENTAGE = 10; // 10% discount for full payment
