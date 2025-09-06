// cit/src/services/courses.js
import api from './api';

export const coursesAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  create: (courseData) => api.post('/courses', courseData),
  update: (id, courseData) => api.put(`/courses/${id}`, courseData),
  delete: (id) => api.delete(`/courses/${id}`),
  enroll: (courseId) => api.post('/courses/enroll', { courseId }),
  getMyCourses: () => api.get('/courses/my-courses'),
  getCourseDetailsForAdmin: (id, search = '', status = 'all') => api.get(`/courses/${id}/details`, { params: { search, status } }),
  getEnrolledStudents: (courseId) => api.get(`/courses/${courseId}/students`),
  getCourseTransactions: (courseId) => api.get(`/courses/${courseId}/transactions`)
};

