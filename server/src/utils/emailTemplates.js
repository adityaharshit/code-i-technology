const verificationEmailTemplate = (name, token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Email Verification - Code i Technology</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #003049;">Code i Technology</h1>
        </div>
        
        <h2 style="color: #003049;">Email Verification</h2>
        
        <p>Hello ${name},</p>
        
        <p>Thank you for registering with Code i Technology. Please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #003049; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p>${verificationLink}</p>
        
        <p>This verification link will expire in 1 hour.</p>
        
        <p>If you didn't create an account with us, please ignore this email.</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #777;">
          If you have any questions, contact us at support@codeitechnology.com<br>
          © ${new Date().getFullYear()} Code i Technology. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;
};

const paymentApprovalEmailTemplate = (name, courseName, amount) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Payment Approved - Code i Technology</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #003049;">Code i Technology</h1>
        </div>
        
        <h2 style="color: #003049;">Payment Approved</h2>
        
        <p>Hello ${name},</p>
        
        <p>Your payment for the course <strong>${courseName}</strong> has been approved.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Course:</strong> ${courseName}</p>
          <p><strong>Amount:</strong> ₹${amount}</p>
          <p><strong>Status:</strong> Approved</p>
        </div>
        
        <p>You can now access the course materials from your dashboard.</p>
        
        <p>Thank you for choosing Code i Technology!</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #777;">
          If you have any questions, contact us at support@codeitechnology.com<br>
          © ${new Date().getFullYear()} Code i Technology. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  verificationEmailTemplate,
  paymentApprovalEmailTemplate
};