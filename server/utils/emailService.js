const nodemailer = require('nodemailer');

// Create a reusable transporter object using the SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// A "sexy" HTML email template
// A "sexy" and highly compatible HTML email template for password reset
const createResetEmailTemplate = (resetLink) => {
    const year = new Date().getFullYear();
    return `
      <!DOCTYPE html>
      <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="x-apple-disable-message-reformatting">
          <title>Password Reset Request</title>
          
          <!--[if mso]>
          <style>
              * {
                  font-family: sans-serif !important;
              }
          </style>
          <![endif]-->
          
          <style>
              html,
              body {
                  margin: 0 auto !important;
                  padding: 0 !important;
                  height: 100% !important;
                  width: 100% !important;
                  background: #f1f5f9;
              }
  
              * {
                  -ms-text-size-adjust: 100%;
                  -webkit-text-size-adjust: 100%;
              }
  
              table,
              td {
                  mso-table-lspace: 0pt !important;
                  mso-table-rspace: 0pt !important;
              }
  
              table {
                  border-spacing: 0 !important;
                  border-collapse: collapse !important;
                  table-layout: fixed !important;
                  margin: 0 auto !important;
              }
  
              img {
                  -ms-interpolation-mode:bicubic;
              }
          </style>
  
      </head>
      <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f5f9;">
          <center style="width: 100%; background-color: #f1f5f9;">
          <!--[if mso | IE]>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="background-color: #ffffff;">
          <tr>
          <td>
          <![endif]-->
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
                      <!-- Red Header Section -->
                      <tr>
                          <td style="padding: 20px 0; text-align: center; background-color: #dc2626;">
                              <img src="https://alshaheen.pro/assets/i21-Bo7dbSjO.jpg" width="120" height="auto" alt="Alshaheen Manpower Logo" border="0" style="height: auto; font-family: sans-serif; font-size: 15px; line-height: 15px; color: #ffffff;">
                          </td>
                      </tr>
                      <!-- Content Section -->
                      <tr>
                          <td style="padding: 40px; font-family: sans-serif; font-size: 16px; line-height: 24px; color: #333333;">
                              <h1 style="margin: 0 0 20px; font-size: 24px; line-height: 30px; color: #1e293b; font-weight: bold;">Password Reset Request</h1>
                              <p style="margin: 0 0 20px;">Hello,</p>
                              <p style="margin: 0 0 20px;">We received a request to reset the password for your Alshaheen Manpower admin account. If you did not make this request, you can safely ignore this email.</p>
                              <p style="margin: 0 0 30px;">To reset your password, please click the button below. This link is only valid for the next 60 minutes.</p>
                              
                              <!-- The Button -->
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: auto;">
                                  <tr>
                                      <td style="border-radius: 6px; background: #dc2626; text-align: center;">
                                          <a href="${resetLink}" style="background: #dc2626; border: 1px solid #dc2626; font-family: sans-serif; font-size: 16px; line-height: 1.1; text-align: center; text-decoration: none; display: inline-block; padding: 14px 28px; color: #ffffff; border-radius: 6px; font-weight: bold;">
                                              <!--[if mso]>
                                              <i style="letter-spacing: 28px; mso-font-width: -100%; mso-text-raise: 30pt;">&nbsp;</i>
                                              <![endif]-->
                                              <span style="mso-text-raise: 15pt;">Reset Your Password</span>
                                              <!--[if mso]>
                                              <i style="letter-spacing: 28px; mso-font-width: -100%;">&nbsp;</i>
                                              <![endif]-->
                                          </a>
                                      </td>
                                  </tr>
                              </table>
                              
                              <p style="margin: 30px 0 20px;">If you're having trouble with the button, copy and paste this URL into your web browser:</p>
                              <p style="margin: 0; word-break: break-all;"><a href="${resetLink}" style="color: #dc2626; text-decoration: underline;">${resetLink}</a></p>
                          </td>
                      </tr>
                      <!-- Footer Section -->
                      <tr>
                          <td style="padding: 30px; text-align: center; background-color: #f8fafc; font-family: sans-serif; font-size: 12px; line-height: 18px; color: #64748b;">
                              <p style="margin: 0;">&copy; ${year} Alshaheen Manpower. All rights reserved.<br>
                              This is an automated message, please do not reply.</p>
                          </td>
                      </tr>
                  </table>
              </div>
          <!--[if mso | IE]>
          </td>
          </tr>
          </table>
          <![endif]-->
          </center>
      </body>
      </html>
    `;
  };

const sendPasswordResetEmail = async (to, token) => {
  // IMPORTANT: Replace 'http://localhost:5173' with your actual frontend URL
  const resetLink = `https://alshaheen.pro/reset-password/${token}`;

  const mailOptions = {
    from: `"Alshaheen Manpower" <${process.env.EMAIL_FROM}>`,
    to: to,
    subject: 'Your Password Reset Link for Alshaheen Manpower',
    html: createResetEmailTemplate(resetLink),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', to);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Could not send email.');
  }
};

module.exports = { sendPasswordResetEmail };