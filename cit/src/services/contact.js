// /cit/src/services/contact.js
import api from './api';

export const contactAPI = {
  /**
   * Sends a message from the contact form.
   * @param {object} contactData - The form data { name, email, subject, message }.
   * @returns {Promise} Axios promise for the request.
   */
  sendMessage: (contactData) => api.post('/contact', contactData),
};
