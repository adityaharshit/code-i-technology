// /server/src/config/email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, 
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

// transporter
//   .verify()
//   .then(() => console.log('Email transporter is ready and verified.'))
//   .catch((err) =>
//     console.error(
//       'Failed to verify email transporter. Check your .env file for correct SMTP credentials and ensure your hosting provider allows outbound connections on the specified port.',
//       err,
//     ),
//   );

const sendEmail = async (to, subject, html, replyTo = null) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'infocodeitechnology@gmail.com',
      to,
      subject,
      html,
    };

    if (replyTo) {
      mailOptions.replyTo = replyTo;
    }

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { transporter, sendEmail };
