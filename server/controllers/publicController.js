const pool = require('../config/db');
const axios = require('axios');

require('dotenv').config();
const imagekit = require('../config/imagekit');

const getPublicVacancies = async (req, res) => {
  try {
    const [vacancies] = await pool.execute(
      'SELECT id, subject, imageUrl FROM vacancies ORDER BY createdAt DESC'
    );
    res.json(vacancies);
  } catch (error) {
    console.error('Error fetching public vacancies:', error);
    res.status(500).json({ message: 'Error fetching vacancies' });
  }
};

const submitForm = async (req, res) => {
  // Helper function to replace empty strings with null
  function normalizeEmptyFields(obj) {
    const result = {};
    for (const key in obj) {
      result[key] = obj[key] === '' ? null : obj[key];
    }
    return result;
  }

  const data = normalizeEmptyFields(req.body);
  const file = req.file;

  console.log("📥 Incoming form data:", data);
  if (file) {
    console.log("📎 File received:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
  } else {
    console.log("⚠️ No file uploaded.");
  }

  let connection;
  try {
    console.log("🔌 Getting database connection...");
    connection = await pool.getConnection();
    console.log("✅ Database connection established.");

    await connection.beginTransaction();
    console.log("🧾 Transaction started.");

    let fileUrl = null;
    let fileType = null;
    let originalFilename = null;

    // --- Upload file to ImageKit if exists ---
    if (file) {
      originalFilename = file.originalname;
      fileType = file.mimetype;

      console.log("☁️ Uploading file to ImageKit...");
      const result = await imagekit.upload({
        file: file.buffer,
        fileName: originalFilename,
        folder: "job_applications",
        useUniqueFileName: true
      });

      fileUrl = result.url;
      console.log("✅ File uploaded successfully:", fileUrl);
    }

    console.log("📋 Fetching table column names...");
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'form_entries' 
      AND TABLE_SCHEMA = DATABASE()
    `);
    console.log("✅ Table columns fetched:", columns.map(c => c.COLUMN_NAME));

    const columnNames = columns.map(col => col.COLUMN_NAME);

    const allPossibleColumns = [
      'email', 'fullName', 'dateOfBirth', 'gender', 'nationality',
      'mobileContact', 'whatsapp', 'currentAddress', 'postalCode',
      'city', 'country', 'cprNationalId', 'passportId', 'passportValidity',
      'educationLevel', 'courseDegree', 'currentlyEmployed', 'employmentDesired',
      'yearsOfExperience', 'availableStart', 'shiftAvailable', 'canTravel',
      'drivingLicense', 'skills', 'ref1Name', 'ref1Contact', 'ref1Email',
      'ref2Name', 'ref2Contact', 'ref2Email', 'ref3Name', 'ref3Contact', 'ref3Email',
      'visaStatus', 'visaValidity', 'expectedSalary', 'clientLeadsStrategy',
      'resumeFile', 'fileType', 'originalFilename'
    ];

    const validColumns = allPossibleColumns.filter(col => columnNames.includes(col));
    console.log("🧩 Valid columns for insert:", validColumns);

    const placeholders = validColumns.map(() => '?').join(', ');
    const sql = `INSERT INTO form_entries (${validColumns.join(', ')}) VALUES (${placeholders})`;

    const values = validColumns.map(col => {
      if (col === 'resumeFile') return fileUrl;
      if (col === 'fileType') return fileType;
      if (col === 'originalFilename') return originalFilename;
      return data[col] || null;
    });

    console.log("🧮 SQL Query:", sql);
    console.log("📦 Values to insert:", values);

    await connection.query(sql, values);
    await connection.commit();
    console.log("✅ Transaction committed successfully.");
    
    res.status(200).send('Form submitted successfully!');
  } catch (err) {
    if (connection) {
      await connection.rollback();
      console.log("⛔ Transaction rolled back due to error.");
    }
    console.error('❌ Error saving form data:', err);
    res.status(500).send('Error saving data');
  } finally {
    if (connection) {
      connection.release();
      console.log("🔚 Database connection released.");
    }
  }
};


const getIpInfo = async (req, res) => {
  try {
    let clientIP = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || '8.8.8.8';
    if (['::1', '127.0.0.1'].includes(clientIP)) clientIP = '8.8.8.8';
    const { data } = await axios.get(`https://freeipapi.com/api/json/${clientIP}`);
    res.json(data);
  } catch (err) {
    console.error('IP API Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch IP info' });
  }
};

const getImagekitAuth = (req, res) => {
  try {
    res.json(imagekit.getAuthenticationParameters());
  } catch (err) {
    console.error('ImageKit auth error:', err);
    res.status(500).send('Error generating auth parameters');
  }
};

const healthCheck = (req, res) => {
  pool.query('SELECT 1')
    .then(() => res.status(200).json({ status: 'healthy', database: 'connected' }))
    .catch(err => res.status(500).json({ status: 'unhealthy', database: 'disconnected', error: err.message }));
};

const getPublicSettings = async (req, res) => {
  try {
    const [settings] = await pool.execute('SELECT * FROM settings');
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.setting_key] = setting.setting_value;
    });
    res.status(200).json(settingsObj);
  } catch (err) {
    console.error('Error retrieving public settings:', err);
    res.status(200).json({ version: '1.0.0' }); // Default fallback
  }
};

module.exports = {
  getPublicVacancies,
  submitForm,
  getIpInfo,
  getImagekitAuth,
  healthCheck,
  getPublicSettings
};