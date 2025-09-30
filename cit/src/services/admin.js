import api from './api';

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getRecentActivity: () => api.get('/admin/recent-activity'),
  getAllStudents: (search = '') => api.get('/admin/students', { params: { search } }),
  getStudentDetails: (id) => api.get(`/admin/students/${id}/details`),
  getIdCardInfoForStudent: (studentId) => api.get(`/admin/students/${studentId}/id-card-info`),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
  getAllCourses: () => api.get('/admin/courses'),
  createCourse: (courseData) => api.post('/admin/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/admin/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/admin/courses/${id}`),
  getAllTransactions: () => api.get('/admin/transactions'),
  updateTransactionStatus: (id, status) => api.patch(`/admin/transactions/${id}/status`, { status }),
  generateManualInvoice: (invoiceData) => api.post('/admin/invoices/manual', invoiceData, {
    responseType: 'text', // Important to get HTML response
  }),
  getCertificateInfo: (studentId, courseId) => api.get(`/admin/students/${studentId}/courses/${courseId}/certificate-info`),
  generateCertificate: (studentId, courseId, data) => api.post(`/admin/students/${studentId}/courses/${courseId}/certificate`, data),
  getMarksheetInfo: (studentId, courseId) => api.get(`/admin/students/${studentId}/courses/${courseId}/marksheet-info`),
  generateMarksheet: (studentId, courseId, data) => api.post(`/admin/students/${studentId}/courses/${courseId}/marksheet`, data),
};