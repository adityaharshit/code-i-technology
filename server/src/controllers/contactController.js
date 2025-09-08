// /server/src/controllers/contactController.js
const { sendContactFormEmail } = require('../services/emailService');

const sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // The 'to' address will be the admin's email from the .env file.
    const adminEmail = process.env.SMTP_USER; 
    if (!adminEmail) {
        console.error("Admin email (SMTP_USER) is not configured in .env. Cannot send contact form email.");
        return res.status(500).json({ error: 'Server is not configured to send emails.' });
    }

    const emailData = { 
      name, 
      from: email, 
      subject, 
      message 
    };

    const success = await sendContactFormEmail(adminEmail, emailData);

    if (success) {
      res.status(200).json({ message: 'Message sent successfully!' });
    } else {
      res.status(500).json({ error: 'Failed to send the message due to a server error.' });
    }
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

module.exports = {
  sendContactEmail,
};
