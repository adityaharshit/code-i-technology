import api from './api';

export const paymentsAPI = {
  create: (transactionData) => api.post('/payments', transactionData),
  getMyTransactions: () => api.get('/payments/my-transactions'),
  getAll: () => api.get('/payments'),
  updateStatus: (id, status) => api.patch(`/payments/${id}/status`, { status }),
  getInvoice: (id) => api.get(`/payments/invoice/${id}`),
  getTransactionById: (id) => api.get(`/payments/${id}`)
};