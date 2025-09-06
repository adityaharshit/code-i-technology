import api from './api';

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getAllStudents: () => api.get('/admin/students'),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
  getAllCourses: () => api.get('/admin/courses'),
  createCourse: (courseData) => api.post('/admin/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/admin/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/admin/courses/${id}`),
  getAllTransactions: () => api.get('/admin/transactions'),
  updateTransactionStatus: (id, status) => api.patch(`/admin/transactions/${id}/status`, { status })
};