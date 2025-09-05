const COURSE_STATUS = {
  UPCOMING: 'upcoming',
  LIVE: 'live',
  COMPLETED: 'completed'
};

const PAYMENT_STATUS = {
  PENDING_APPROVAL: 'pending approval',
  PAID: 'paid',
  REJECTED: 'rejected'
};

const PAYMENT_MODE = {
  ONLINE: 'online',
  OFFLINE: 'offline'
};

const DISCOUNT_PERCENTAGE = 10; // 10% discount for full payment

module.exports = {
  COURSE_STATUS,
  PAYMENT_STATUS,
  PAYMENT_MODE,
  DISCOUNT_PERCENTAGE
};