const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const db = require('../config/db');

// Cloudinary config
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

// Helper: get Google Sheets client from DB credentials
const getGoogleSheetsClient = async () => {
  const keys = ['google_client_email', 'google_private_key'];
  const [rows] = await db.query(
    `SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN (${keys.map(() => '?').join(',')})`,
    keys
  );

  const creds = {};
  rows.forEach(r => { creds[r.setting_key] = r.setting_value; });

  if (!creds.google_client_email || !creds.google_private_key) {
    throw new Error('Google credentials not configured in admin settings.');
  }

  const privateKey = creds.google_private_key
    .replace(/\\n/g, '\n')
    .trim();

  // Use google-auth-library JWT directly - compatible with Node 22
  const { JWT } = require('google-auth-library');
  const jwtClient = new JWT({
    email: creds.google_client_email,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  // Get access token manually and use fetch to call Sheets API
  const tokenResponse = await jwtClient.getAccessToken();
  const accessToken = tokenResponse.token;

  // Return a simple append function instead of sheets client
  return { accessToken };
};

// Helper: get Google Sheet ID from DB
const getSheetId = async () => {
  const [rows] = await db.query(
    "SELECT setting_value FROM site_settings WHERE setting_key = 'google_sheet_id'"
  );
  if (!rows.length || !rows[0].setting_value) {
    throw new Error('Google Sheet ID not configured in admin settings.');
  }
  return rows[0].setting_value;
};

router.post(
  '/register',
  upload.fields([
    { name: 'applicantPhoto', maxCount: 1 }, { name: 'vehicleRegDoc', maxCount: 1 },
    { name: 'cprFrontDoc', maxCount: 1 }, { name: 'cprBackDoc', maxCount: 1 },
    { name: 'licenseFrontDoc', maxCount: 1 }, { name: 'licenseBackDoc', maxCount: 1 },
  ]),
  async (req, res) => {
    console.log('📥 [RiderRoute] POST /register received');

    try {
      const { files } = req;

      console.log('📥 [RiderRoute] req.body keys:', Object.keys(req.body));
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

      console.log('📤 [RiderRoute] Fetching Google credentials from DB...');
      const { accessToken } = await getGoogleSheetsClient();
      const sheetId = await getSheetId();
      console.log('📤 [RiderRoute] Appending row to Google Sheet ID:', sheetId);

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

      const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`;
      const appendRes = await fetch(appendUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values: [newRow] }),
      });

      if (!appendRes.ok) {
        const errBody = await appendRes.text();
        throw new Error(`Sheets API error ${appendRes.status}: ${errBody}`);
      }

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