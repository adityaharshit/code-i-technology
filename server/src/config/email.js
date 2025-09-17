// /server/src/config/email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  // You can uncomment the 'service' property for well-known providers like Gmail
  // This often handles host, port, and security settings for you.
  service: 'gmail',
  host: process.env.SMTP_HOST, // e.g., 'smtp.gmail.com' for Gmail
  port: parseInt(process.env.SMTP_PORT || '587', 10), // 465 for SSL, 587 for TLS/STARTTLS
  secure: process.env.SMTP_PORT === '465', // `true` for port 465, `false` for all other ports
  auth: {
    // IMPORTANT: For services like Gmail, you MUST generate and use an "App Password",
    // not your regular account password, due to modern security standards.
    // Google "Gmail App Password" to learn how to create one.
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    // This option can help in environments with strict SSL/TLS policies.
    // It tells the transport not to fail if the certificate is self-signed.
    rejectUnauthorized: false,
  },
});

transporter
  .verify()
  .then(() => console.log('Email transporter is ready and verified.'))
  .catch((err) =>
    console.error(
      'Failed to verify email transporter. Check your .env file for correct SMTP credentials and ensure your hosting provider allows outbound connections on the specified port.',
      err,
    ),
  );

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
