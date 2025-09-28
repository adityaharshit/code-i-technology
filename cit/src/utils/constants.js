// Re-export shared constants for client-side use
export {
  APP_NAME,
  APP_VERSION,
  COURSE_STATUS,
  PAYMENT_STATUS,
  PAYMENT_MODES,
  USER_ROLES,
  GENDER_OPTIONS,
  BLOOD_GROUP_OPTIONS,
  QUALIFICATION_OPTIONS,
  OCCUPATION_OPTIONS,
  DISCOUNT_PERCENTAGE
} from '../../shared/constants';

export const COURSE_TYPE_OPTIONS = [
    { value: 1, label: 'Coding' },
    { value: 2, label: 'Non-coding' },
    { value: 3, label: 'Typing' },
];