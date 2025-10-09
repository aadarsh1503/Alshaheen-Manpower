const express = require('express');
const router = express.Router();
const multer = require('multer');
const ImageKit = require('imagekit');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// --- ImageKit Initialization (Unchanged) ---
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// --- Multer Setup (Unchanged) ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
  // --- MODIFIED: Multer now expects 4 separate files ---
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
      const { files } = req;
      // --- MODIFIED: Destructure new fields from req.body ---
      const {
        title, firstName, lastName, email, residenceCountry, phone,
        nationality, originDestination, visaExpiry, licenseExpiry, experience,
        alternatePhone, currentAddress, permanentAddress, vehicleType
      } = req.body;

      // 1. Upload all 4 files to ImageKit
      const uploadPromises = [];
      if (files.cprFrontDoc) {
        uploadPromises.push(imagekit.upload({
          file: files.cprFrontDoc[0].buffer, fileName: `cpr-front-${Date.now()}`, folder: '/rider_registrations',
        }));
      }
      if (files.cprBackDoc) {
        uploadPromises.push(imagekit.upload({
          file: files.cprBackDoc[0].buffer, fileName: `cpr-back-${Date.now()}`, folder: '/rider_registrations',
        }));
      }
      if (files.licenseFrontDoc) {
         uploadPromises.push(imagekit.upload({
          file: files.licenseFrontDoc[0].buffer, fileName: `license-front-${Date.now()}`, folder: '/rider_registrations',
        }));
      }
       if (files.licenseBackDoc) {
         uploadPromises.push(imagekit.upload({
          file: files.licenseBackDoc[0].buffer, fileName: `license-back-${Date.now()}`, folder: '/rider_registrations',
        }));
      }
      
      const uploadResults = await Promise.all(uploadPromises);

      // --- MODIFIED: Assign URLs based on the files that were uploaded ---
      // This mapping relies on the order in which promises were added above.
      let cprFrontUrl = '', cprBackUrl = '', licenseFrontUrl = '', licenseBackUrl = '';
      if (files.cprFrontDoc) cprFrontUrl = uploadResults.shift().url;
      if (files.cprBackDoc) cprBackUrl = uploadResults.shift().url;
      if (files.licenseFrontDoc) licenseFrontUrl = uploadResults.shift().url;
      if (files.licenseBackDoc) licenseBackUrl = uploadResults.shift().url;


      // 2. --- MODIFIED: Prepare the new row with all fields for Google Sheets ---
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
      const errMsg = error.message || 'An error occurred during the registration process.';
      res.status(500).json({ message: 'Registration failed on the server.', error: errMsg });
    }
  }
);

module.exports = router;