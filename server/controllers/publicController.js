const pool = require('../config/db');
const imagekit = require('../config/imagekit');
const axios = require('axios');

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
  function normalizeEmptyFields(obj) {
    const result = {};
    for (const key in obj) {
      result[key] = obj[key] === '' ? null : obj[key];
    }
    return result;
  }

  const data = normalizeEmptyFields(req.body);
  const file = req.file;

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    let fileUrl = null;
    let fileType = null;
    let originalFilename = null;

    if (file) {
      originalFilename = file.originalname;
      fileType = file.mimetype;

      const result = await imagekit.upload({
        file: file.buffer,
        fileName: originalFilename,
        folder: "job_applications",
        useUniqueFileName: true
      });
      fileUrl = result.url;
    }

    const [columns] = await connection.execute(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'form_entries' AND TABLE_SCHEMA = DATABASE()`);
    const columnNames = columns.map(col => col.COLUMN_NAME);
    
    const allPossibleColumns = ['email', 'fullName', 'dateOfBirth', 'gender', 'nationality', 'mobileContact', 'whatsapp', 'currentAddress', 'postalCode', 'city', 'country', 'cprNationalId', 'passportId', 'passportValidity', 'educationLevel', 'courseDegree', 'currentlyEmployed', 'employmentDesired', 'yearsOfExperience', 'availableStart', 'shiftAvailable', 'canTravel', 'drivingLicense', 'skills', 'ref1Name', 'ref1Contact', 'ref1Email', 'ref2Name', 'ref2Contact', 'ref2Email', 'ref3Name', 'ref3Contact', 'ref3Email', 'visaStatus', 'visaValidity', 'expectedSalary', 'clientLeadsStrategy', 'resumeFile', 'fileType', 'originalFilename'];
    
    const validColumns = allPossibleColumns.filter(col => columnNames.includes(col));
    const placeholders = validColumns.map(() => '?').join(', ');
    const sql = `INSERT INTO form_entries (${validColumns.join(', ')}) VALUES (${placeholders})`;

    const values = validColumns.map(col => {
        if (col === 'resumeFile') return fileUrl;
        if (col === 'fileType') return fileType;
        if (col === 'originalFilename') return originalFilename;
        return data[col] || null;
    });

    await connection.query(sql, values);
    await connection.commit();
    res.status(200).send('Form submitted successfully!');
  } catch (err) {
    if (connection) await connection.rollback();
    console.error('Error saving form data:', err);
    res.status(500).send('Error saving data');
  } finally {
    if (connection) connection.release();
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

module.exports = {
  getPublicVacancies,
  submitForm,
  getIpInfo,
  getImagekitAuth,
  healthCheck
};