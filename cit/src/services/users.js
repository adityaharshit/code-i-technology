import api from './api';

/**
 * API service for user-related operations.
 */
export const usersAPI = {
  /**
   * Fetches the detailed profile of the currently logged-in student.
   * @returns {Promise<Object>} The student profile data.
   */
  getProfile: () => api.get('/users/profile'),

  /**
   * Updates the profile of the currently logged-in student.
   * @param {Object} profileData - The updated profile information.
   * @returns {Promise<Object>} The updated student profile data.
   */
  updateProfile: (profileData) => api.put('/users/profile', profileData),

  /**
   * Gets a user by ID (admin only).
   * @param {number} id - The user ID.
   * @returns {Promise<Object>} The user data.
   */
  getUserById: (id) => api.get(`/users/${id}`),

  /**
   * Fetches the dashboard statistics for the currently logged-in student.
   * @returns {Promise<Object>} The dashboard stats data.
   */
  getDashboardStats: () => api.get('/users/dashboard-stats'),
};
