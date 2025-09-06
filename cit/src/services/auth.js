import api from './api';

// import axios from 'axios';


export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  register: (data) => api.post('/auth/register', data),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
  checkUsername: (username) => api.post('/auth/check-username', { username }),
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
