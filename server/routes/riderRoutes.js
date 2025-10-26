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
    public_id: (req, file) => {
      const name = `${file.fieldname}-${Date.now()}`;
      console.log(`🆔 Generated Cloudinary public_id: ${name}`);
      return name;
    },
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB limit
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
    console.log('🚀 Received new registration request at /register endpoint.');
    console.log('🔍 Headers:', req.headers);

    if (!sheets) {
      console.error('⚠️ Google Sheets not configured. Cannot proceed.');
      return res.status(500).json({
        message: 'Server configuration error: Google Sheets service is not available.',
      });
    }

    try {
      console.log('📝 Parsing form data and uploaded files...');
      const { files } = req;

      // --- MODIFICATION START: Destructure all new form fields from req.body ---
      const {
        title, firstName, lastName, email, residenceCountry, phone,
        nationality, originDestination, visaExpiry, licenseExpiry, experience,
        alternatePhone, vehicleType,
        // New detailed address fields
        currentAddress_flat, currentAddress_road, currentAddress_block, currentAddress_town,
        permanentAddress_flat, permanentAddress_road, permanentAddress_block, permanentAddress_town,
        // New employment fields
        currentEmployer, previousCompany, previousExperience
      } = req.body;
      // --- MODIFICATION END ---

      console.log('📦 Form fields received successfully.');
      console.table(req.body);

      console.log('🖼 Uploaded files info:', files);

      // --- Combine address fields for cleaner spreadsheet entry ---
      const fullCurrentAddress = `Flat: ${currentAddress_flat}, Road: ${currentAddress_road}, Block: ${currentAddress_block}, Town: ${currentAddress_town}`;
      const fullPermanentAddress = `Flat: ${permanentAddress_flat}, Road: ${permanentAddress_road}, Block: ${permanentAddress_block}, Town: ${permanentAddress_town}`;
      console.log('🏠 Combined address fields:', { fullCurrentAddress, fullPermanentAddress });

      // --- Extract Cloudinary URLs ---
      console.log('🌩 Extracting Cloudinary URLs from uploaded files...');
      const cprFrontUrl = files['cprFrontDoc'] ? files['cprFrontDoc'][0].path : '';
      const cprBackUrl = files['cprBackDoc'] ? files['cprBackDoc'][0].path : '';
      const licenseFrontUrl = files['licenseFrontDoc'] ? files['licenseFrontDoc'][0].path : '';
      const licenseBackUrl = files['licenseBackDoc'] ? files['licenseBackDoc'][0].path : '';

      console.log('✅ Cloudinary URLs generated:', {
        cprFrontUrl, cprBackUrl, licenseFrontUrl, licenseBackUrl
      });

      // --- Prepare new row for Google Sheets ---
      const newRow = [
        new Date().toISOString(),
        title,
        firstName,
        lastName,
        email,
        phone,
        alternatePhone || 'N/A',
        residenceCountry,
        nationality,
        fullCurrentAddress,
        fullPermanentAddress,
        vehicleType,
        originDestination,
        visaExpiry,
        licenseExpiry,
        currentEmployer,
        previousCompany || 'N/A',
        previousExperience || 'N/A',
        experience || 'N/A',
        cprFrontUrl,
        cprBackUrl,
        licenseFrontUrl,
        licenseBackUrl,
      ];

      console.log('🧾 Prepared data row for Google Sheets:');
      console.table(newRow);

      // --- Append to Google Sheets ---
      console.log('📤 Sending data to Google Sheets...');
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A1',
        valueInputOption: 'USER_ENTERED',
        resource: { values: [newRow] },
      });

      console.log('✅ Google Sheets API response:', response.status, response.statusText);
      console.log('✅ Data successfully appended to Google Sheets.');

      res.status(200).json({ message: 'Registration successful!' });
      console.log('🎉 Registration completed successfully for:', email);

    } catch (error) {
      console.error('❌ Registration Error:', error);

      let errMsg = 'An error occurred during the registration process.';
      if (error.code === 'LIMIT_FILE_SIZE') {
        errMsg = 'File is too large. Each image must be 1MB or less.';
      } else if (error.message && error.message.includes('Invalid file type')) {
        errMsg = 'Invalid file type. Please upload only images (JPG, JPEG, PNG).';
      } else if (error.message) {
        errMsg = error.message;
      }

      console.warn('⚠️ Sending error response to client:', errMsg);
      res.status(500).json({ message: 'Registration failed.', error: errMsg });
    }
  }
);

console.log('✅ Riders route successfully loaded and ready.');
module.exports = router;
