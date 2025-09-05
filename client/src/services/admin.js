import api from './api';

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getAllStudents: () => api.get('/admin/students'),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`)
};