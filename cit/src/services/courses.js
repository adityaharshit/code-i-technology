// Enhanced Courses API with Better Timeout Handling
import api from './api';

export const coursesAPI = {
  // Standard operations with default timeout
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  
  // Heavy operations with extended timeout
  create: (courseData) => api.longRequest({
    method: 'post',
    url: '/courses',
    data: courseData
  }),
  
  update: (id, courseData) => api.longRequest({
    method: 'put',
    url: `/courses/${id}`,
    data: courseData
  }),
  
  delete: (id) => api.longRequest({
    method: 'delete',
    url: `/courses/${id}`
  }),
  
  enroll: (courseId) => api.longRequest({
    method: 'post',
    url: '/courses/enroll',
    data: { courseId }
  }),
  
  // User-specific operations with extended timeout
  getMyCourses: () => api.longRequest({
    method: 'get',
    url: '/courses/my-courses'
  }),
  
  // Admin operations with maximum timeout
  getCourseDetailsForAdmin: (id, search = '', status = 'all') => api.longRequest({
    method: 'get',
    url: `/courses/${id}/details`,
    params: { search, status }
  }),
  
  getEnrolledStudents: (courseId) => api.longRequest({
    method: 'get',
    url: `/courses/${courseId}/students`
  }),
  
  getCourseTransactions: (courseId) => api.longRequest({
    method: 'get',
    url: `/courses/${courseId}/transactions`
  })
};

