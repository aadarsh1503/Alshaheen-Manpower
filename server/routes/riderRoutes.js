// routes/riders.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
// --- MODIFIED: Import Cloudinary packages and remove ImageKit ---
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// --- NEW: Cloudinary Configuration ---
// This automatically configures Cloudinary using your CLOUDINARY_URL environment variable.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- NEW: Multer Configuration for Cloudinary ---
// We configure multer to upload files directly to Cloudinary.
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'rider_registrations', // Folder name on Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed image formats
    // Generate a unique public_id (filename) for each file
    public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
  },
});

// --- NEW: Multer Middleware with Validation ---
const upload = multer({
  storage: storage,
  // 1. Limit file size to 1MB (1 * 1024 * 1024 bytes)
  limits: { fileSize: 1 * 1024 * 1024 },
  // 2. Filter for image file types
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Invalid file type. Only images are allowed!'), false); // Reject
    }
  },
});

// --- Google Sheets API Setup (Unchanged) ---
let sheets;
try {
  const GOOGLE_CREDENTIALS_PATH = path.join(process.cwd(), 'google-credentials.json');
  if (fs.existsSync(GOOGLE_CREDENTIALS_PATH)) {
    const credentials = JSON.parse(fs.readFileSync(GOOGLE_CREDENTIALS_PATH));
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    sheets = google.sheets({ version: 'v4', auth });
    console.log('✅ Google Sheets API client initialized successfully.');
  } else {
    console.error('❌ Could not find google-credentials.json. Google Sheets integration will be disabled.');
  }
} catch (error) {
  console.error('❌ Error initializing Google Sheets API client:', error);
}

// --- API Endpoint: POST /api/riders/register ---
router.post(
  '/register',
  // --- Multer middleware for handling the 4 separate file fields ---
  upload.fields([
    { name: 'cprFrontDoc', maxCount: 1 },
    { name: 'cprBackDoc', maxCount: 1 },
    { name: 'licenseFrontDoc', maxCount: 1 },
    { name: 'licenseBackDoc', maxCount: 1 },
  ]),
  async (req, res) => {
    if (!sheets) {
        return res.status(500).json({ message: 'Server configuration error: Google Sheets service is not available.' });
    }

    try {
      // --- MODIFIED: Files are already uploaded. Get their URLs from req.files ---
      // The `req.files` object contains details of the uploaded files from Cloudinary.
      const { files } = req;
      const {
        title, firstName, lastName, email, residenceCountry, phone,
        nationality, originDestination, visaExpiry, licenseExpiry, experience,
        alternatePhone, currentAddress, permanentAddress, vehicleType
      } = req.body;

      // 1. Get URLs from the uploaded files.
      // The `path` property contains the public URL of the image on Cloudinary.
      const cprFrontUrl = files['cprFrontDoc'] ? files['cprFrontDoc'][0].path : '';
      const cprBackUrl = files['cprBackDoc'] ? files['cprBackDoc'][0].path : '';
      const licenseFrontUrl = files['licenseFrontDoc'] ? files['licenseFrontDoc'][0].path : '';
      const licenseBackUrl = files['licenseBackDoc'] ? files['licenseBackDoc'][0].path : '';

      // 2. Prepare the new row with all fields for Google Sheets
      const newRow = [
        new Date().toISOString(), title, firstName, lastName, email, residenceCountry, 
        phone, nationality, originDestination, visaExpiry, licenseExpiry, experience,
        alternatePhone, currentAddress, permanentAddress, vehicleType,
        cprFrontUrl, cprBackUrl, licenseFrontUrl, licenseBackUrl
      ];

      // 3. Append data to Google Sheets
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A1',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [newRow],
        },
      });

      // 4. Send success response
      res.status(200).json({ message: 'Registration successful!' });

    } catch (error) {
      console.error('Registration Error:', error);
      
      // --- MODIFIED: Better error messages for file validation ---
      let errMsg = 'An error occurred during the registration process.';
      if (error.code === 'LIMIT_FILE_SIZE') {
        errMsg = 'File is too large. Each image must be 1MB or less.';
      } else if (error.message.includes('Invalid file type')) {
        errMsg = 'Invalid file type. Please upload only images (JPG, JPEG, PNG).';
      } else if (error.message) {
        errMsg = error.message;
      }
      
      res.status(500).json({ message: 'Registration failed.', error: errMsg });
    }
  }
);

module.exports = router;