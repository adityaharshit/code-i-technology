// /server/src/services/emailService.js
const { sendEmail } = require('../config/email');
const { verificationEmailTemplate, paymentApprovalEmailTemplate, contactFormEmailTemplate } = require('../utils/emailTemplates');

const sendVerificationEmail = async (email, name, token) => {
  const subject = 'Verify Your Email - Code i Technology';
  const html = verificationEmailTemplate(name, token);
  
  try {
    const success = await sendEmail(email, subject, html);
    return success;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

const sendPaymentApprovalEmail = async (email, name, courseName, amount) => {
// ... existing code ...
};

/**
 * Sends the content of the contact form to the site administrator.
 * @param {string} to - The admin's email address.
 * @param {object} data - The form data ({ name, from, subject, message }).
 * @returns {Promise<boolean>} True if the email was sent successfully.
 */
const sendContactFormEmail = async (to, data) => {
  const subject = `New Contact Message: ${data.subject}`;
  const html = contactFormEmailTemplate(data);
  
  try {
    // We send the email TO the admin and set the user's email as the reply-to address
    await sendEmail(to, subject, html, data.from);
    return true;
  } catch (error) {
    console.error('Error sending contact form email:', error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPaymentApprovalEmail,
  sendContactFormEmail,
};
