import express from 'express';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// POST route for contact form submission
router.post('/', async (req, res) => {
    const { firstName, lastName, email, company, website, phone, countryCode , companyType } = req.body;
  
    // Create a unique reference ID
    const referenceId = uuidv4().split('-')[0];
  
    // Email configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can replace it with any email provider
      auth: {
        user: 'alshaheen.pro@gmail.com',
        pass: 'pwrl wudc nktz mmrc', 
      },
    });
  
    // Email message content
    let companyTypeText = '';
    if (companyType === 'I am an employer looking to Hire') {
      companyTypeText = 'I am an employer looking to Hire';
    } else if (companyType === 'I am a job seeker looking for jobs') {
      companyTypeText = 'I am a job seeker looking for jobs';
    } else if (companyType === 'I am a Supplier') {
      companyTypeText = 'I am a Supplier';
    }
  
    const mailOptions = {
      from: 'alshaheen.pro@gmail.com', // Sender email (your email)
      to: 'alshaheen.pro@gmail.com', // Send the email to your email only
      subject: `New Contact Form Submission from ${email}`, // Include sender's email in the subject
      text: `
        Reference ID: ${referenceId}
        Name: ${firstName} ${lastName}
        Email: ${email}
        Company Type: ${companyType} 
        Company: ${company}
        Website: ${website}
        Phone: ${countryCode} ${phone}
      `,
    };
  
    // Send email
    try {
      await transporter.sendMail(mailOptions);
      res.json({ success: true, referenceId }); // Return the reference ID with success
    } catch (error) {
      console.error('Error sending email:', error);
      res.json({ success: false, error: error.message });
    }
  });
  
  export default router;
  