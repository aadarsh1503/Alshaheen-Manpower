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
const upload = multer({ storage: storage });

// --- UPDATED: Google Sheets API Setup (Loading from Environment Variables) ---
let sheets;
try {
  // Check if essential environment variables are present
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error('Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY in .env file');
  }

  // Construct the credentials object directly from environment variables
  const credentials = {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    // IMPORTANT: Un-escape the newline characters for the private key
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
  };

  // Authenticate using the constructed credentials object
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  sheets = google.sheets({ version: 'v4', auth });
  console.log('✅ Google Sheets client configured successfully from environment variables.');

} catch (error) {
  console.error('❌ Could not configure Google Sheets client:', error.message);
  // The 'sheets' variable will be undefined, and the API route will fail gracefully.
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

      // A safer way to get URLs if order is not guaranteed
      uploadResults.forEach(result => {
        if (result.filePath.includes('cpr-')) {
            cprUrl = result.url;
        } else if (result.filePath.includes('license-')) {
            licenseUrl = result.url;
        }
      });

      // 2. Append data to Google Sheets
      const newRow = [
        new Date().toISOString(), title, firstName, lastName, email, residenceCountry, 
        phone, nationality, originDestination, visaExpiry, licenseExpiry, experience,
        cprUrl, licenseUrl,
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A1', // Appends after the last row in this range
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [newRow],
        },
      });

      // 3. Send success response
      res.status(200).json({ message: 'Registration successful!' });

    } catch (error)
    {
      console.error('Registration Error:', error);
      // Send back a more specific error if available
      const errMsg = error.response?.data?.error?.message || 'An error occurred during registration.';
      res.status(500).json({ message: errMsg, error: error.message });
    }
  }
);

module.exports = router;