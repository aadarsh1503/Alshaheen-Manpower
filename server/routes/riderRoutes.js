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
  const GOOGLE_CREDENTIALS_PATH = path.join(process.cwd(), 'google-credentials.json');
  if (fs.existsSync(GOOGLE_CREDENTIALS_PATH)) {
    const credentials = JSON.parse(fs.readFileSync(GOOGLE_CREDENTIALS_PATH));
    const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
    sheets = google.sheets({ version: 'v4', auth });
    console.log('✅ Google Sheets API client initialized successfully.');
  } else { console.error('❌ Could not find google-credentials.json.'); }
} catch (error) { console.error('❌ Error initializing Google Sheets API client:', error); }


router.post(
  '/register',
  upload.fields([
    { name: 'applicantPhoto', maxCount: 1 }, { name: 'vehicleRegDoc', maxCount: 1 },
    { name: 'cprFrontDoc', maxCount: 1 }, { name: 'cprBackDoc', maxCount: 1 },
    { name: 'licenseFrontDoc', maxCount: 1 }, { name: 'licenseBackDoc', maxCount: 1 },
  ]),
  async (req, res) => {
    if (!sheets) { return res.status(500).json({ message: 'Server configuration error: Google Sheets service is not available.' }); }

    try {
      const { files } = req;

      // MODIFICATION: Removed `previousCompany` from destructuring
      const {
        title, firstName, lastName, email, residenceCountry, phone,
        nationality, originDestination, visaExpiry, licenseExpiry, experience,
        alternatePhone, vehicleType,
        currentAddress_flat, currentAddress_road, currentAddress_block, currentAddress_town,
        companyName, isVehicleOwner, readyToStartDate, previousExperience
      } = req.body;

      console.log('📦 Form fields received:', req.body);

      const fullCurrentAddress = `Flat: ${currentAddress_flat}, Road: ${currentAddress_road}, Block: ${currentAddress_block}, Town: ${currentAddress_town}`;

      const applicantPhotoUrl = files['applicantPhoto'] ? files['applicantPhoto'][0].path : '';
      const vehicleRegUrl = files['vehicleRegDoc'] ? files['vehicleRegDoc'][0].path : '';
      const cprFrontUrl = files['cprFrontDoc'] ? files['cprFrontDoc'][0].path : '';
      const cprBackUrl = files['cprBackDoc'] ? files['cprBackDoc'][0].path : '';
      const licenseFrontUrl = files['licenseFrontDoc'] ? files['licenseFrontDoc'][0].path : '';
      const licenseBackUrl = files['licenseBackDoc'] ? files['licenseBackDoc'][0].path : '';

      // MODIFICATION: Removed `previousCompany` from the newRow array
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
        vehicleType,
        isVehicleOwner,
        originDestination,
        visaExpiry,
        licenseExpiry,
        readyToStartDate,
        companyName, // This will now correctly be "Fresher" or the company name
        previousExperience, // This will be "0" or the years of experience
        experience, // This will be "N/A" or the details
        applicantPhotoUrl,
        cprFrontUrl,
        cprBackUrl,
        licenseFrontUrl,
        licenseBackUrl,
        vehicleRegUrl,
      ];

      console.log('🧾 Preparing data row for Google Sheets:', newRow);
      
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A1',
        valueInputOption: 'USER_ENTERED',
        resource: { values: [newRow] },
      });

      console.log('✅ Data successfully appended to Google Sheets.');
      res.status(200).json({ message: 'Registration successful!' });

    } catch (error) {
      console.error('❌ Registration Error:', error);
      let errMsg = 'An error occurred during the registration process.';
      if (error.code === 'LIMIT_FILE_SIZE') { errMsg = 'File is too large. Each image must be 1MB or less.'; }
      else if (error.message && error.message.includes('Invalid file type')) { errMsg = 'Invalid file type. Please upload only images (JPG, JPEG, PNG).'; }
      else if (error.message) { errMsg = error.message; }
      res.status(500).json({ message: 'Registration failed.', error: errMsg });
    }
  }
);

module.exports = router;