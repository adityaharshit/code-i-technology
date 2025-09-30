// cit/src/services/payments.js
import api from './api';

export const paymentsAPI = {
  create: (transactionData) => api.post('/payments', transactionData),
  getMyTransactions: () => api.get('/payments/my-transactions'),
  getAll: (search = '', status = 'all') => api.get('/payments', { params: { search, status } }),
  updateStatus: (id, status) => api.patch(`/payments/${id}/status`, { status }),
  getInvoice: (id) => api.get(`/payments/invoice/${id}`),
  getTransactionById: (id) => api.get(`/payments/${id}`),
  getLastTransactionForCourse: (courseId) => api.get(`/payments/course/${courseId}/last-transaction`),
};

