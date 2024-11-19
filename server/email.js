import express from 'express';
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Handle ES module __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const router = express.Router();

// Multer setup to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document/;
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, or DOCX files are allowed.'));
    }
  }
}).single('document'); // The field name in the form should be 'document'

// POST route for contact form submission
router.post('/', upload, async (req, res) => {
  const { firstName, lastName, email, company, website, phone, countryCode, companyType } = req.body;
  const referenceId = uuidv4().split('-')[0]; // Unique reference ID

  // Create transporter for nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Use environment variable
      pass: process.env.EMAIL_PASS, // Use environment variable
    },
  });
  
  // Determine company type text
  let companyTypeText = '';
  if (companyType === 'I am an employer looking to Hire') {
    companyTypeText = 'I am an employer looking to Hire';
  } else if (companyType === 'I am a job seeker looking for jobs') {
    companyTypeText = 'I am a job seeker looking for jobs';
  } else if (companyType === 'I am a Supplier') {
    companyTypeText = 'I am a Supplier';
  }
  
  // Create the email message content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Contact Form Submission from ${email}`,
    text: `Reference ID: ${referenceId}
           Name: ${firstName} ${lastName}
           Email: ${email}
           Company Type: ${companyTypeText}
           Company: ${company}
           Website: ${website}
           Phone: ${countryCode} ${phone}`,
    attachments: req.file
      ? [
          {
            filename: req.file.filename,
            path: path.join(__dirname, 'uploads', req.file.filename),
          },
        ]
      : [], // No attachment if no file uploaded
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, referenceId }); // Send success response with reference ID
  } catch (error) {
    console.error('Error sending email:', error);
    res.json({ success: false, error: error.message }); // Send error response
  }
});

export default router;
