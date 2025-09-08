export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };

  return new Date(dateString).toLocaleDateString('en-IN', defaultOptions);
};

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatAddress = (address) => {
  if (!address) return '';
  
  const parts = [
    address.flatHouseNo,
    address.street,
    address.po && `PO: ${address.po}`,
    address.ps && `PS: ${address.ps}`,
    address.district,
    address.state,
    address.pincode && `Pincode: ${address.pincode}`
  ].filter(Boolean);

  return parts.join(', ');
};

export const formatCourseStatus = (status) => {
  const statusMap = {
    upcoming: 'Upcoming',
    live: 'Live',
    completed: 'Completed'
  };
  return statusMap[status] || status;
};

export const formatPaymentStatus = (status) => {
  const statusMap = {
    'pending approval': 'Pending Approval',
    'paid': 'Paid',
    'rejected': 'Rejected'
  };
  return statusMap[status] || status;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateMonthsOptions = (maxMonths) => {
  return Array.from({ length: maxMonths }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} month${i + 1 > 1 ? 's' : ''}`
  }));
};

export const calculatePayment = (feePerMonth, months, courseDuration) => {
  const amount = feePerMonth * months;
  let discount = 0;

  if (months === courseDuration) {
    discount = amount * (10 / 100); // 10% discount
  }

  const netPayable = amount - discount;

  return {
    amount,
    discount,
    netPayable
  };
};

export const formatDistanceToNow = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return `${Math.floor(seconds)} seconds ago`;
  
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.floor(minutes)} minutes ago`;

  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)} hours ago`;

  const days = hours / 24;
  if (days < 30) return `${Math.floor(days)} days ago`;

  const months = days / 30;
  if (months < 12) return `${Math.floor(months)} months ago`;
  
  const years = days / 365;
  return `${Math.floor(years)} years ago`;
};