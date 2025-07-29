const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const ImageKit = require('imagekit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware Setup ---
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- ImageKit Configuration ---
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// --- Multer Configuration (for file uploads) ---
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// --- MySQL Connection Pool ---
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  multipleStatements: true
});

// Verify pool connection on startup
pool.getConnection()
  .then(connection => {
    console.log('✅ Successfully connected to MySQL database.');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });

// =================================================================
// ✨ SECURITY: AUTHENTICATION MIDDLEWARE ✨
// This function protects our admin routes by verifying a JWT.
// =================================================================
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // The token is expected in the format: "Bearer <TOKEN>"
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    // 401 Unauthorized: The request lacks valid authentication credentials.
    return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_secret', (err, user) => {
    if (err) {
      // 403 Forbidden: The server understands the request but refuses to authorize it.
      // This happens if the token is expired or invalid.
      console.error('JWT Verification Error:', err.message);
      return res.status(403).json({ message: 'Token is not valid.' });
    }
    // If the token is valid, attach the decoded user payload to the request object
    req.user = user;
    next(); // Proceed to the next middleware or the route handler
  });
};

// =================================================================
// 🔓 PUBLIC API ROUTES (No Authentication Needed)
// =================================================================

// GET public vacancies for the main website carousel
app.get('/api/vacancies', async (req, res) => {
  try {
    const [vacancies] = await pool.execute(
      'SELECT id, subject, imageUrl FROM vacancies ORDER BY createdAt DESC'
    );
    res.json(vacancies);
  } catch (error) {
    console.error('Error fetching public vacancies:', error);
    res.status(500).json({ message: 'Error fetching vacancies' });
  }
});

// POST a new form entry from a job applicant
app.post('/submit-form', upload.single('file'), async (req, res) => {
  // Helper to convert empty strings to NULL for the database
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
        useUniqueFileName: true // Use true to avoid overwriting files with the same name
      });
      fileUrl = result.url;
    }

    const [columns] = await connection.execute(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'form_entries' AND TABLE_SCHEMA = DATABASE()`);
    const columnNames = columns.map(col => col.COLUMN_NAME);
    const hasOriginalFilenameCol = columnNames.includes('originalFilename');

    // Define all possible columns that can come from the form
    const allPossibleColumns = ['email', 'fullName', 'dateOfBirth', 'gender', 'nationality', 'mobileContact', 'whatsapp', 'currentAddress', 'postalCode', 'city', 'country', 'cprNationalId', 'passportId', 'passportValidity', 'educationLevel', 'courseDegree', 'currentlyEmployed', 'employmentDesired', 'yearsOfExperience', 'availableStart', 'shiftAvailable', 'canTravel', 'drivingLicense', 'skills', 'ref1Name', 'ref1Contact', 'ref1Email', 'ref2Name', 'ref2Contact', 'ref2Email', 'ref3Name', 'ref3Contact', 'ref3Email', 'visaStatus', 'visaValidity', 'expectedSalary', 'clientLeadsStrategy', 'resumeFile', 'fileType'];
    if (hasOriginalFilenameCol) {
        allPossibleColumns.push('originalFilename');
    }
    
    // Filter to only include columns that actually exist in the table
    const validColumns = allPossibleColumns.filter(col => columnNames.includes(col));
    
    const placeholders = validColumns.map(() => '?').join(', ');
    const sql = `INSERT INTO form_entries (${validColumns.join(', ')}) VALUES (${placeholders})`;

    // Map form data to the valid columns
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
});


// =================================================================
// 🔑 AUTHENTICATION ROUTES (For Admin Login/Signup)
// =================================================================

// Admin signup (can be disabled or protected after initial setup)
app.post('/admin/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.execute('INSERT INTO admin_users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    res.status(201).json({ message: 'Admin user registered successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'An admin with this email already exists' });
    }
    console.error('Admin signup error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Admin login
app.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [results] = await pool.execute('SELECT * FROM admin_users WHERE email = ?', [email]);
    
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_secret',
      { expiresIn: '8h' } // Increased token expiration time
    );
    res.json({ token });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});


// =================================================================
// 🔒 SECURED ADMIN API ROUTES (Authentication Required)
// =================================================================

// GET all vacancies for the admin panel
app.get('/api/admin/vacancies', authenticateAdmin, async (req, res) => {
  try {
    const [vacancies] = await pool.execute('SELECT id, subject, imageUrl, imageFileId, createdAt FROM vacancies ORDER BY id DESC');
    res.json(vacancies);
  } catch (error) {
    console.error('Error fetching admin vacancies:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new vacancy
app.post('/api/admin/vacancies', authenticateAdmin, upload.single('image'), async (req, res) => {
  const { subject } = req.body;
  const file = req.file;

  if (!subject || !file) {
    return res.status(400).json({ message: 'Subject and image are required.' });
  }
  try {
    const imageKitResult = await imagekit.upload({ file: file.buffer, fileName: file.originalname, folder: "vacancies" });
    const [result] = await pool.execute('INSERT INTO vacancies (subject, imageUrl, imageFileId) VALUES (?, ?, ?)', [subject, imageKitResult.url, imageKitResult.fileId]);
    res.status(201).json({ id: result.insertId, subject, imageUrl: imageKitResult.url });
  } catch (error) {
    console.error('Error creating vacancy:', error);
    res.status(500).json({ message: 'Failed to create vacancy' });
  }
});

// PUT (update) a vacancy
app.put('/api/admin/vacancies/:id', authenticateAdmin, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { subject } = req.body;
  const file = req.file;
  if (!subject) return res.status(400).json({ message: 'Subject is required.' });

  try {
    if (file) {
      const [currentVacancy] = await pool.execute('SELECT imageFileId FROM vacancies WHERE id = ?', [id]);
      const oldImageFileId = currentVacancy.length > 0 ? currentVacancy[0].imageFileId : null;
      const newImageResult = await imagekit.upload({ file: file.buffer, fileName: file.originalname, folder: "vacancies" });
      await pool.execute('UPDATE vacancies SET subject = ?, imageUrl = ?, imageFileId = ? WHERE id = ?', [subject, newImageResult.url, newImageResult.fileId, id]);
      if (oldImageFileId) await imagekit.deleteFile(oldImageFileId).catch(err => console.error("Old ImageKit file delete failed:", err));
    } else {
      await pool.execute('UPDATE vacancies SET subject = ? WHERE id = ?', [subject, id]);
    }
    res.status(200).json({ message: 'Vacancy updated successfully.' });
  } catch (error) {
    console.error(`Error updating vacancy ${id}:`, error);
    res.status(500).json({ message: 'Failed to update vacancy.' });
  }
});

// DELETE a vacancy
app.delete('/api/admin/vacancies/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute('SELECT imageFileId FROM vacancies WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Vacancy not found' });
    
    if (rows[0].imageFileId) {
        await imagekit.deleteFile(rows[0].imageFileId).catch(err => console.error("ImageKit file delete failed:", err));
    }
    await pool.execute('DELETE FROM vacancies WHERE id = ?', [id]);
    res.status(200).json({ message: 'Vacancy deleted successfully' });
  } catch (error) {
    console.error(`Error deleting vacancy ${id}:`, error);
    res.status(500).json({ message: 'Failed to delete vacancy' });
  }
});

// GET all form entries for the admin dashboard with filtering
app.get('/admin/form-entries', authenticateAdmin, async (req, res) => {
  try {
    const [columns] = await pool.execute(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'form_entries' AND COLUMN_NAME = 'originalFilename'`);
    const hasOriginalFilename = columns.length > 0;
    
    let baseQuery = hasOriginalFilename ? 'SELECT *, originalFilename FROM form_entries' : 'SELECT * FROM form_entries';
    const conditions = [];
    const values = [];

    // Build query conditions
    if (req.query.searchTerm) {
      conditions.push('(fullName LIKE ? OR email LIKE ? OR skills LIKE ? OR city LIKE ? OR country LIKE ?)');
      values.push(
        `%${req.query.searchTerm}%`, 
        `%${req.query.searchTerm}%`, 
        `%${req.query.searchTerm}%`,
        `%${req.query.searchTerm}%`,
        `%${req.query.searchTerm}%`
      );
    }

    if (req.query.email) {
      conditions.push('email LIKE ?');
      values.push(`%${req.query.email}%`);
    }

    if (req.query.nationality) {
      conditions.push('LOWER(nationality) LIKE LOWER(?)');
      values.push(`%${req.query.nationality}%`);
    }

    if (req.query.city) {
      conditions.push('LOWER(city) LIKE LOWER(?)');
      values.push(`%${req.query.city}%`);
    }

    if (req.query.country) {
      conditions.push('LOWER(country) LIKE LOWER(?)');
      values.push(`%${req.query.country}%`);
    }

    if (req.query.educationLevel) {
      conditions.push('educationLevel = ?');
      values.push(req.query.educationLevel);
    }

    if (req.query.visaStatus) {
      if (req.query.visaStatus === 'Expired') {
        conditions.push('(passportValidity IS NOT NULL AND passportValidity < CURRENT_DATE)');
      } else if (req.query.visaStatus === 'Valid') {
        conditions.push('(passportValidity IS NOT NULL AND passportValidity >= CURRENT_DATE)');
      } else if (req.query.visaStatus === 'None') {
        conditions.push('passportValidity IS NULL');
      }
    }

    // Date range filtering
    if (req.query.dateRange && req.query.dateRange !== 'all') {
      switch (req.query.dateRange) {
        case 'today':
          conditions.push('DATE(submittedAt) = CURRENT_DATE');
          break;
        case '24h':
          conditions.push('submittedAt >= DATE_SUB(NOW(), INTERVAL 24 HOUR)');
          break;
        case '7d':
          conditions.push('submittedAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)');
          break;
        case '30d':
          conditions.push('submittedAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)');
          break;
        case '1y':
          conditions.push('submittedAt >= DATE_SUB(NOW(), INTERVAL 1 YEAR)');
          break;
        case 'custom':
          if (req.query.customStart) {
            conditions.push('submittedAt >= ?');
            values.push(new Date(req.query.customStart).toISOString().slice(0, 19).replace('T', ' '));
          }
          if (req.query.customEnd) {
            conditions.push('submittedAt <= ?');
            values.push(new Date(req.query.customEnd).toISOString().slice(0, 19).replace('T', ' '));
          }
          break;
      }
    }

    baseQuery += conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';
    baseQuery += ' ORDER BY submittedAt DESC';

    const [results] = await pool.execute(baseQuery, values);
    
    const processedResults = results.map(entry => ({
      ...entry,
      currentlyEmployed: entry.currentlyEmployed,
      visaStatus: entry.visaStatus || null,
      originalFilename: hasOriginalFilename ? entry.originalFilename : null
    }));

    res.status(200).json(processedResults);
  } catch (err) {
    
    res.status(500).send('Error retrieving data');
  }
});

// Form submission with transaction support and column check
app.post('/submit-form', upload.single('file'), async (req, res) => {
  

  // Helper function to convert empty fields to NULL
  function normalizeEmptyFields(obj) {
    const result = {};
    for (const key in obj) {
      result[key] = obj[key] === '' ? null : obj[key];
    }
    return result;
  }

  const data = normalizeEmptyFields(req.body);
  const file = req.file;



  try {
    const connection = await pool.getConnection();
    

    await connection.beginTransaction();
   

    try {
      let fileUrl = null;
      let fileType = null;
      let originalFilename = null;

      if (file) {
        originalFilename = file.originalname;
        fileType = file.mimetype;

        console.log("📤 Uploading file to ImageKit...");
        const result = await imagekit.upload({
          file: file.buffer,
          fileName: originalFilename,
          folder: "job_applications",
          useUniqueFileName: false
        });

        fileUrl = result.url;
        
      }

      // Check available columns
      const [columns] = await connection.execute(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'form_entries'
        AND TABLE_SCHEMA = DATABASE()
      `);

      const columnNames = columns.map(col => col.COLUMN_NAME);
    

      const hasOriginalFilename = columnNames.includes('originalFilename');

      const baseColumns = [
        'email', 'fullName', 'dateOfBirth','gender', 'nationality', 'mobileContact', 'whatsapp', 'currentAddress',
        'postalCode', 'city', 'country', 'cprNationalId', 'passportId', 'passportValidity', 'educationLevel', 
        'courseDegree', 'currentlyEmployed', 'employmentDesired','yearsOfExperience', 'availableStart', 'shiftAvailable', 
        'canTravel', 'drivingLicense', 'skills', 'ref1Name', 'ref1Contact', 'ref1Email', 'ref2Name', 
        'ref2Contact', 'ref2Email', 'ref3Name', 'ref3Contact', 'ref3Email', 'visaStatus', 'visaValidity', 
        'expectedSalary', 'clientLeadsStrategy', 'resumeFile', 'fileType'
      ];

      const validColumns = baseColumns.filter(col => columnNames.includes(col));
      if (hasOriginalFilename) {
        validColumns.push('originalFilename');
      }

      const placeholders = validColumns.map(() => '?').join(', ');
      const sql = `INSERT INTO form_entries (${validColumns.join(', ')}) VALUES (${placeholders})`;

      const baseValues = [
        data.email, data.fullName, data.dateOfBirth, data.gender, data.nationality, data.mobileContact, 
        data.whatsapp, data.currentAddress, data.postalCode, data.city, data.country,
        data.cprNationalId, data.passportId, data.passportValidity, data.educationLevel, 
        data.courseDegree, data.currentlyEmployed, data.employmentDesired, data.yearsOfExperience, data.availableStart, 
        data.shiftAvailable, data.canTravel, data.drivingLicense, data.skills,
        data.ref1Name, data.ref1Contact, data.ref1Email, data.ref2Name, data.ref2Contact, 
        data.ref2Email, data.ref3Name, data.ref3Contact, data.ref3Email,
        data.visaStatus, data.visaValidity, data.expectedSalary, data.clientLeadsStrategy,
        fileUrl, fileType
      ];

      const values = baseValues.slice(0, validColumns.length - (hasOriginalFilename ? 1 : 0));
      if (hasOriginalFilename) {
        values.push(originalFilename);
      }



      await connection.query(sql, values);


      await connection.commit();
   

      res.status(200).send('Form submitted successfully!');
    } catch (err) {
      await connection.rollback();
     
      res.status(500).send('Error saving data');
    } finally {
      connection.release();
      
    }
  } catch (err) {
    
    res.status(500).send('Database connection error');
  }
});


app.get('/ipapi', async (req, res) => {
  try {
    let clientIP = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || '8.8.8.8';
    if (['::1', '127.0.0.1'].includes(clientIP)) clientIP = '8.8.8.8'; // Fallback for local dev
    const { data } = await axios.get(`https://freeipapi.com/api/json/${clientIP}`);
    res.json(data);
  } catch (err) {
    console.error('IP API Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch IP info' });
  }
});

// ImageKit authentication endpoint (for client-side uploads if ever needed)
app.get('/imagekit-auth', (req, res) => {
  try {
    res.json(imagekit.getAuthenticationParameters());
  } catch (err) {
    console.error('ImageKit auth error:', err);
    res.status(500).send('Error generating auth parameters');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  pool.query('SELECT 1')
    .then(() => res.status(200).json({ status: 'healthy', database: 'connected' }))
    .catch(err => res.status(500).json({ status: 'unhealthy', database: 'disconnected', error: err.message }));
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Alshaheen Manpower API Server is running!');
});
// Error handling middleware
app.use((err, req, res, next) => {

  res.status(500).send('Internal Server Error');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});