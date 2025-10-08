const express = require('express');
const router = express.Router();
const multer = require('multer');
const ImageKit = require('imagekit');
const { google } = require('googleapis');

// --- ImageKit Initialization ---
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// --- Multer Setup ---
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- Google Sheets Setup ---
let sheets;
try {
  // Check if essential env variables exist
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
    throw new Error('Missing GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, or GOOGLE_SHEET_ID in .env');
  }

  // Fix private key formatting for Render deployment
  const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

  // Create JWT auth client
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheets = google.sheets({ version: 'v4', auth });
  console.log('✅ Google Sheets client configured successfully.');

} catch (error) {
  console.error('❌ Could not configure Google Sheets client:', error.message);
}

// --- API Endpoint: POST /api/riders/register ---
router.post(
  '/register',
  upload.fields([
    { name: 'cprDoc', maxCount: 1 },
    { name: 'licenseDoc', maxCount: 1 },
  ]),
  async (req, res) => {
    // Ensure Sheets client is ready
    if (!sheets) {
      return res.status(500).json({ message: 'Google Sheets service is not configured correctly on the server.' });
    }

    try {
      const { files } = req;
      const {
        title, firstName, lastName, email, residenceCountry, phone,
        nationality, originDestination, visaExpiry, licenseExpiry, experience,
      } = req.body;

      // --- Upload files to ImageKit ---
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

      uploadResults.forEach(result => {
        if (result.filePath.includes('cpr-')) cprUrl = result.url;
        else if (result.filePath.includes('license-')) licenseUrl = result.url;
      });

      // --- Append data to Google Sheets ---
      const newRow = [
        new Date().toISOString(),
        title, firstName, lastName, email, residenceCountry,
        phone, nationality, originDestination, visaExpiry, licenseExpiry, experience,
        cprUrl, licenseUrl,
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A1',
        valueInputOption: 'USER_ENTERED',
        resource: { values: [newRow] },
      });

      res.status(200).json({ message: 'Registration successful!' });

    } catch (error) {
      console.error('Registration Error:', error);
      const errMsg = error.response?.data?.error?.message || 'An error occurred during registration.';
      res.status(500).json({ message: errMsg, error: error.message });
    }
  }
);

module.exports = router;
