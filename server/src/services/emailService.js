const { sendEmail } = require('../config/email');
const { verificationEmailTemplate, paymentApprovalEmailTemplate } = require('../utils/emailTemplates');

const sendVerificationEmail = async (email, name, token) => {
  const subject = 'Verify Your Email - Code i Technology';
  const html = verificationEmailTemplate(name, token);
  
  try {
    await sendEmail(email, subject, html);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

const sendPaymentApprovalEmail = async (email, name, courseName, amount) => {
  const subject = 'Payment Approved - Code i Technology';
  const html = paymentApprovalEmailTemplate(name, courseName, amount);
  
  try {
    await sendEmail(email, subject, html);
    return true;
  } catch (error) {
    console.error('Error sending payment approval email:', error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPaymentApprovalEmail
};