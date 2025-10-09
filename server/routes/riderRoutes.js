// routes/riders.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// ===================== CLOUDINARY CONFIG =====================
console.log('🔧 Initializing Cloudinary configuration...');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log('✅ Cloudinary configured successfully.');

// ===================== MULTER CONFIG =====================
console.log('🔧 Setting up Multer storage for Cloudinary...');
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'rider_registrations',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    console.log(`📤 Validating file: ${file.originalname} (${file.mimetype})`);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      console.warn(`🚫 Rejected file: ${file.originalname} (Invalid type)`);
      cb(new Error('Invalid file type. Only images are allowed!'), false);
    }
  },
});
console.log('✅ Multer configured successfully.');

// ===================== GOOGLE SHEETS SETUP =====================
let sheets;
try {
  console.log('🔧 Initializing Google Sheets API...');
  const GOOGLE_CREDENTIALS_PATH = path.join(process.cwd(), 'google-credentials.json');
  console.log(`🗂 Checking for credentials at: ${GOOGLE_CREDENTIALS_PATH}`);

  if (fs.existsSync(GOOGLE_CREDENTIALS_PATH)) {
    console.log('✅ google-credentials.json found.');
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

// ===================== API ENDPOINT =====================
router.post(
  '/register',
  upload.fields([
    { name: 'cprFrontDoc', maxCount: 1 },
    { name: 'cprBackDoc', maxCount: 1 },
    { name: 'licenseFrontDoc', maxCount: 1 },
    { name: 'licenseBackDoc', maxCount: 1 },
  ]),
  async (req, res) => {
    console.log('🚀 Received new registration request.');

    if (!sheets) {
      console.error('⚠️ Google Sheets not configured. Cannot proceed.');
      return res.status(500).json({
        message: 'Server configuration error: Google Sheets service is not available.',
      });
    }

    try {
      console.log('📝 Parsing form data and uploaded files...');
      const { files } = req;
      const {
        title, firstName, lastName, email, residenceCountry, phone,
        nationality, originDestination, visaExpiry, licenseExpiry, experience,
        alternatePhone, currentAddress, permanentAddress, vehicleType
      } = req.body;

      console.log('📦 Form fields received:', req.body);
      console.log('🖼 Uploaded files info:', files);

      // --- Extract Cloudinary URLs ---
      const cprFrontUrl = files['cprFrontDoc'] ? files['cprFrontDoc'][0].path : '';
      const cprBackUrl = files['cprBackDoc'] ? files['cprBackDoc'][0].path : '';
      const licenseFrontUrl = files['licenseFrontDoc'] ? files['licenseFrontDoc'][0].path : '';
      const licenseBackUrl = files['licenseBackDoc'] ? files['licenseBackDoc'][0].path : '';

      console.log('✅ Cloudinary URLs:');
      console.log('  - CPR Front:', cprFrontUrl);
      console.log('  - CPR Back:', cprBackUrl);
      console.log('  - License Front:', licenseFrontUrl);
      console.log('  - License Back:', licenseBackUrl);

      // --- Prepare new row ---
      const newRow = [
        new Date().toISOString(), title, firstName, lastName, email, residenceCountry,
        phone, nationality, originDestination, visaExpiry, licenseExpiry, experience,
        alternatePhone, currentAddress, permanentAddress, vehicleType,
        cprFrontUrl, cprBackUrl, licenseFrontUrl, licenseBackUrl,
      ];

      console.log('🧾 Prepared data row for Google Sheets:', newRow);

      // --- Append to Google Sheets ---
      console.log('📤 Appending data to Google Sheet...');
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A1',
        valueInputOption: 'USER_ENTERED',
        resource: { values: [newRow] },
      });

      console.log('✅ Google Sheets response:', response.data);

      res.status(200).json({ message: 'Registration successful!' });
      console.log('🎉 Registration completed successfully for:', email);

    } catch (error) {
      console.error('❌ Registration Error:', error);

      let errMsg = 'An error occurred during the registration process.';
      if (error.code === 'LIMIT_FILE_SIZE') {
        errMsg = 'File is too large. Each image must be 1MB or less.';
      } else if (error.message.includes('Invalid file type')) {
        errMsg = 'Invalid file type. Please upload only images (JPG, JPEG, PNG).';
      } else if (error.message) {
        errMsg = error.message;
      }

      console.warn('⚠️ Sending error response to client:', errMsg);
      res.status(500).json({ message: 'Registration failed.', error: errMsg });
    }
  }
);

console.log('✅ Riders route successfully loaded.');
module.exports = router;
