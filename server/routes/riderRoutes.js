const express = require('express');
const router = express.Router();
const multer = require('multer');
const ImageKit = require('imagekit');
const { google } = require('googleapis');

// --- NEW: Hardcoded Private Key String (USE WITH CAUTION) ---
// This is the exact key you provided, stored as a single-line string.
const HARDCODED_PRIVATE_KEY_STRING = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCWW29tuOhOrl9Cy6dDFAsuvb0DGAD512I/eGjPfV9TkQYRWs7DE/KbpJzvbXO7y96KSXQPwxVLdtfo8iJZUUZUoT2OG27MU7MC8ajKW5mAwwtuJJJpOhv1A0T2+ANS19l3vZOqZAA0tVqGkEVPtmXzbUpuR4jJZYsdpb7fyhmGfzRbFYOZ1nF3G9cYy7sqbxD78MvpJrkDicGjiMGhl0pUXiwl5CzUcFKlxAvyarsoAzFiR4uHiEdf+ZBPs41J2VtwTIhY1/YP4VZKngHh1qRoxu9Q3RkghU7k1G3SlluX8pxf9gHZdrxzGKFO5OFlJ7rRsSU+aXPMyWC3yXQ1MZTfzAgMBAAECggEAAm53G634/8YSdKOTew0OGJLpRW1eyADjg1rrTakINh3rHF5nZ+s2KgMxpdjoyA7bdJ63JEbHh4wOoM3tn/Elsy+qWFZ5kQ9Xc+2RiQ2N1XG8s8AeqASluBggm40rjJbrWuQzc6F2CWQsvcQD2EP/BmlBjLgBGR9Ybmx5l5KOnXNXJQJhQhzJN+/svCVnVrd6NHx9mVlxWPZarRDNYpgc5pJg6JAWnc0cGeXoAWndvp6tGWkuj8yrrjkfRjNpxWLCNZJAlvtNwLAgLHmTX+u1SbVxAy6GgBRe+0FRXcTsr/I9o2aJUcYmdEo2NSSg9MUhvzalZeae60mnf7xZ9Obr2QKBgQDSpZALf6tVT/ipE95+o+EN/Gz5/M+iDPnd2CwuSblqjreEiTbB4S0YGjyl7d6BNv0iswoVoID1OLfhyuvZD0sse1B4158/2j22KI9rksgexcj2CpbS6h+bP/2Hyr/e0fSnEUdgEWVQsh+nN9icZncLBUFfwz/26GoVP0AxOh+TqwKBgQC2utRZq0mV9aqGh31nVLg4jMXc1NwYMZojdpQGOdgT6sMML8rIL1av9zEv3S3wDXAFIBV5uRXc+o+ABXFWL3dt6QO4nhX2NV1O86019QCSRxHs3WvHxR1piOczRT+0whfDeq7e1Eb9uMncqOMZvf/9D3GZ0/+2N4/AvCmd5ck2QKBgQCXrSt5fCaMuZbdeDcfjTVCct6tawK/NwS8XyoA8okWV0mBn6PUGyXzUwEUoaEz/bpsP+slA3uYF40ggpMsqryAfRLG0MwUmDsTbUVIOlrq/ZPkxl8v4/F6Qqt2GeHqudembOSuIhiH8JqmN6o7g/R39QLLx7XJPjUUs4SvbaDLHQKBgQCvr9PpXvHCN9A7xltBFUiGPnsixpnSvSiVOsXzCu6zQAYCE4BKFBFbBmtZ04aCAVDsnAmEDhnvJ2jJMcW814S9fwpCsWXpeHZLYDRu1bBmfiqtmZMFy8kdEJ7e7KNKGlbLJNRrNAgJfDjBarPnFTHh+o5Ly3Ppm2QgeAk/YiZiQKBgAr4oQhK51Z3shVeJ0M8nu3vbz5yO29yPGfz/Qu0ltkeBiC21h5Je3JBpm4BfOuJrat6D75C6T1YxtO85NY8ohrtRu2ybS/hvkp4vgWwPiML/nCd5LW77MuTvhE/ZpG8/xY3N1N3Gri5lr7uEYLcikdVE1ERTqbRLLoWRMX1Y7ka\n-----END PRIVATE KEY-----";

// --- ImageKit Initialization ---
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// --- Multer Setup ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Google Sheets Setup ---
let sheets;
try {
  // Check if the client email env variable is present
  if (!process.env.GOOGLE_CLIENT_EMAIL) {
    throw new Error('Missing GOOGLE_CLIENT_EMAIL in environment variables');
  }

  // The key string has literal "\\n" characters, so we must replace them
  // with actual newline characters ('\n') for the crypto library to read it.
  const formattedPrivateKey = HARDCODED_PRIVATE_KEY_STRING.replace(/\\n/g, '\n');

  // Create JWT auth client using the hardcoded key
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: formattedPrivateKey, // Use the formatted hardcoded key here
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheets = google.sheets({ version: 'v4', auth });
  console.log('✅ Google Sheets client configured successfully using hardcoded key.');

} catch (error) {
  console.error('❌ Could not configure Google Sheets client:', error);
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
        range: 'Sheet1!A1',
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
      const errMsg = error.response?.data?.error?.message || 'An error occurred during registration.';
      res.status(500).json({ message: errMsg, error: error.message });
    }
  }
);

module.exports = router;