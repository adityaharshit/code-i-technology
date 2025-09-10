import api from './api';

// import axios from 'axios';


// Enhanced Auth API with Better Timeout Handling
export const authAPI = {
  // Authentication operations with extended timeout
  login: (data) => api.authRequest({
    method: 'post',
    url: '/auth/login',
    data
  }),
  
  logout: () => api.quickRequest({
    method: 'post',
    url: '/auth/logout'
  }),
  
  getCurrentUser: () => api.authRequest({
    method: 'get',
    url: '/auth/me'
  }),
  
  register: (data) => api.authRequest({
    method: 'post',
    url: '/auth/register',
    data
  }),
  
  verifyEmail: (token) => api.quickRequest({
    method: 'post',
    url: '/auth/verify-email',
    data: { token }
  }),
  
  resendVerification: (email) => api.quickRequest({
    method: 'post',
    url: '/auth/resend-verification',
    data: { email }
  }),
  
  checkUsername: (username) => api.quickRequest({
    method: 'post',
    url: '/auth/check-username',
    data: { username }
  }),
};


// export const authAPI = {
//   register: (userData) => api.post('/auth/register', userData),
//   login: (credentials) => api.post('/auth/login', credentials),
//   logout: () => api.post('/auth/logout'),
//   verifyEmail: (token) => api.post('/auth/verify-email', { token }),
//   /**
//    * Fetches basic info for the currently authenticated user to verify the session.
//    * @returns {Promise<Object>} The user's basic data (id, name, type).
//    */
//   getCurrentUser: () => api.get('/auth/me'),
//   /**
//    * Resends verification email to the user.
//    * @param {string} email - The user's email address.
//    * @returns {Promise<Object>} Success response.
//    */
//   resendVerification: (email) => api.post('/auth/resend-verification', { email }),
// };
