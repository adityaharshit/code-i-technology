// /server/src/config/email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., 'smtp.gmail.com' for Gmail
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  secure: false, // `true` for port 465, `false` for all other ports
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
      from: `"${process.env.EMAIL_FROM_NAME || 'Code i Technology'}" <${process.env.EMAIL_FROM_ADDRESS}>`,
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
