const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Cloudinary and Multer config remains the same...
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'rider_registrations', allowed_formats: ['jpg', 'jpeg', 'png'], public_id: (req, file) => `${file.fieldname}-${Date.now()}` },
});
const upload = multer({ storage: storage, limits: { fileSize: 1 * 1024 * 1024 }, fileFilter: (req, file, cb) => { if (file.mimetype.startsWith('image/')) { cb(null, true); } else { cb(new Error('Invalid file type. Only images are allowed!'), false); } } });

// Google Sheets setup remains the same...
let sheets;
try {
  // Check if essential environment variables are loaded
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error('Google credentials environment variables not set.');
  }

  // Construct the credentials object from environment variables
  const credentials = {
    type: process.env.GOOGLE_TYPE,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    // Replace literal \n with actual newlines for production environments
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    // These are standard URLs and can be hardcoded or put in .env if you prefer
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.GOOGLE_CLIENT_EMAIL)}`
  };

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  sheets = google.sheets({ version: 'v4', auth });
  console.log('✅ Google Sheets API client initialized successfully from environment variables.');

} catch (error) {
  console.error('❌ Error initializing Google Sheets API client:', error.message);
}

router.post(
  '/register',
  upload.fields([
    { name: 'applicantPhoto', maxCount: 1 }, { name: 'vehicleRegDoc', maxCount: 1 },
    { name: 'cprFrontDoc', maxCount: 1 }, { name: 'cprBackDoc', maxCount: 1 },
    { name: 'licenseFrontDoc', maxCount: 1 }, { name: 'licenseBackDoc', maxCount: 1 },
  ]),
  async (req, res) => {
    console.log('📥 [RiderRoute] POST /register received');
    console.log('📥 [RiderRoute] sheets initialized:', !!sheets);

    if (!sheets) {
      console.error('❌ [RiderRoute] Google Sheets not initialized - check env vars');
      console.error('❌ [RiderRoute] GOOGLE_CLIENT_EMAIL:', process.env.GOOGLE_CLIENT_EMAIL ? '✅ set' : '❌ missing');
      console.error('❌ [RiderRoute] GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? '✅ set' : '❌ missing');
      console.error('❌ [RiderRoute] GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID ? '✅ set' : '❌ missing');
      return res.status(500).json({ message: 'Server configuration error: Google Sheets service is not available.' });
    }

    try {
      const { files } = req;

      console.log('📥 [RiderRoute] req.body keys:', Object.keys(req.body));
      console.log('📥 [RiderRoute] req.body:', req.body);
      console.log('📥 [RiderRoute] files received:', Object.keys(files || {}));

      const {
        gender, firstName, lastName, email, phone,
        nationality, visaExpiry, licenseExpiry, experience,
        alternatePhone, vehicleType,
        currentAddress_flat, currentAddress_road, currentAddress_block, currentAddress_town,
        companyName, isVehicleOwner, readyToStartDate, previousExperience
      } = req.body;

      const fullCurrentAddress = `Flat: ${currentAddress_flat}, Road: ${currentAddress_road}, Block: ${currentAddress_block}, Town: ${currentAddress_town}`;

      const applicantPhotoUrl = files['applicantPhoto'] ? files['applicantPhoto'][0].path : '';
      const vehicleRegUrl = files['vehicleRegDoc'] ? files['vehicleRegDoc'][0].path : '';
      const cprFrontUrl = files['cprFrontDoc'] ? files['cprFrontDoc'][0].path : '';
      const cprBackUrl = files['cprBackDoc'] ? files['cprBackDoc'][0].path : '';
      const licenseFrontUrl = files['licenseFrontDoc'] ? files['licenseFrontDoc'][0].path : '';
      const licenseBackUrl = files['licenseBackDoc'] ? files['licenseBackDoc'][0].path : '';

      console.log('📤 [RiderRoute] Cloudinary upload URLs:', { applicantPhotoUrl, vehicleRegUrl, cprFrontUrl, cprBackUrl, licenseFrontUrl, licenseBackUrl });

      const newRow = [
        new Date().toISOString(),
        gender, firstName, lastName, email, phone,
        alternatePhone || 'N/A',
        nationality, fullCurrentAddress, vehicleType, isVehicleOwner,
        visaExpiry, licenseExpiry, readyToStartDate,
        companyName, previousExperience, experience,
        applicantPhotoUrl, cprFrontUrl, cprBackUrl,
        licenseFrontUrl, licenseBackUrl, vehicleRegUrl,
      ];

      console.log('📤 [RiderRoute] Appending row to Google Sheet ID:', process.env.GOOGLE_SHEET_ID);

      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A1',
        valueInputOption: 'USER_ENTERED',
        resource: { values: [newRow] },
      });

      console.log('✅ [RiderRoute] Row appended to Google Sheet successfully');
      res.status(200).json({ message: 'Registration successful!' });

    } catch (error) {
      console.error('❌ [RiderRoute] Registration Error:', error.message);
      console.error('❌ [RiderRoute] Full error:', error);
      let errMsg = 'An error occurred during the registration process.';
      if (error.code === 'LIMIT_FILE_SIZE') { errMsg = 'File is too large. Each image must be 1MB or less.'; }
      else if (error.message && error.message.includes('Invalid file type')) { errMsg = 'Invalid file type. Please upload only images (JPG, JPEG, PNG).'; }
      else if (error.message) { errMsg = error.message; }
      res.status(500).json({ message: 'Registration failed.', error: errMsg });
    }
  }
);

module.exports = router;