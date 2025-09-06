// cit/src/services/admin.js
import api from './api';

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllStudents: (search = '') => api.get('/admin/students', { params: { search } }),
  getStudentDetails: (id) => api.get(`/admin/students/${id}/details`),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
  getAllCourses: () => api.get('/admin/courses'),
  createCourse: (courseData) => api.post('/admin/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/admin/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/admin/courses/${id}`),
  getAllTransactions: () => api.get('/admin/transactions'),
  updateTransactionStatus: (id, status) => api.patch(`/admin/transactions/${id}/status`, { status })
};

