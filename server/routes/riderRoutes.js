const express = require('express');
const router = express.Router();
const multer = require('multer');
const ImageKit = require('imagekit');
const { google } = require('googleapis');
const path = require('path'); // Import path module
const fs = require('fs'); // Import file system module

// --- ImageKit Initialization ---
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// --- Multer Setup ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- FIXED: Google Sheets API Setup ---
// This is the modern and more robust way to load credentials.
// It reads the file content directly, avoiding path issues.
const GOOGLE_CREDENTIALS_PATH = path.join(process.cwd(), 'google-credentials.json');

let sheets;
try {
  const credentials = JSON.parse(fs.readFileSync(GOOGLE_CREDENTIALS_PATH));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  sheets = google.sheets({ version: 'v4', auth });
} catch (error) {
  console.error('❌ Could not load Google credentials. Make sure google-credentials.json exists.', error);
}


// --- API Endpoint: POST /api/riders/register ---
router.post(
  '/register',
  upload.fields([
    { name: 'cprDoc', maxCount: 1 },
    { name: 'licenseDoc', maxCount: 1 },
  ]),
  async (req, res) => {
    // Check if sheets client was initialized
    if (!sheets) {
        return res.status(500).json({ message: 'Google Sheets service is not configured correctly on the server.' });
    }

    try {
      const { files } = req;
      const {
        title, firstName, lastName, email, residenceCountry, phone,
        nationality, originDestination, visaExpiry, licenseExpiry, experience,
      } = req.body;

      // 1. Upload files to ImageKit
      let cprUrl = '';
      let licenseUrl = '';

      const uploadPromises = [];
      if (files.cprDoc && files.cprDoc[0]) {
        uploadPromises.push(
          imagekit.upload({
            file: files.cprDoc[0].buffer,
            fileName: `cpr-${firstName}-${lastName}-${Date.now()}`,
            folder: '/rider_registrations',
          })
        );
      }
      if (files.licenseDoc && files.licenseDoc[0]) {
        uploadPromises.push(
          imagekit.upload({
            file: files.licenseDoc[0].buffer,
            fileName: `license-${firstName}-${lastName}-${Date.now()}`,
            folder: '/rider_registrations',
          })
        );
      }
      
      const uploadResults = await Promise.all(uploadPromises);

      if (files.cprDoc && files.cprDoc[0]) cprUrl = uploadResults.shift().url;
      if (files.licenseDoc && files.licenseDoc[0]) licenseUrl = uploadResults.shift().url;

      // 2. Append data to Google Sheets
      const newRow = [
        new Date().toISOString(), title, firstName, lastName, email, residenceCountry, 
        phone, nationality, originDestination, visaExpiry, licenseExpiry, experience,
        cprUrl, licenseUrl,
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A1',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [newRow],
        },
      });

      // 3. Send success response
      res.status(200).json({ message: 'Registration successful!' });

    } catch (error) {
      console.error('Registration Error:', error);
      // Send back a more specific error if available
      const errMsg = error.response?.data?.error?.message || 'An error occurred during registration.';
      res.status(500).json({ message: errMsg, error: error.message });
    }
  }
);

module.exports = router;