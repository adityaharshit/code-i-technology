import api from './api';

export const coursesAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  create: (courseData) => api.post('/courses', courseData),
  update: (id, courseData) => api.put(`/courses/${id}`, courseData),
  delete: (id) => api.delete(`/courses/${id}`),
  enroll: (courseId) => api.post('/courses/enroll', { courseId }),
  getMyCourses: () => api.get('/courses/my-courses'),
  getEnrolledStudents: (courseId) => api.get(`/courses/${courseId}/students`),
  getCourseTransactions: (courseId) => api.get(`/courses/${courseId}/transactions`)
};