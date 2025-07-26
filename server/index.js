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

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ImageKit configuration
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Multer memory storage for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// MySQL connection pool
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

// Verify pool connection
pool.getConnection()
  .then(connection => {
    console.log('Connected to MySQL');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

// File download endpoint
app.get('/download-file', async (req, res) => {
  try {
    const { url, filename } = req.query;
    if (!url) return res.status(400).send('File URL required');
    
    let contentType = 'application/octet-stream';
    let extension = '';
    
    if (filename) {
      extension = path.extname(filename).toLowerCase();
    } else {
      const urlPath = new URL(url).pathname;
      extension = path.extname(urlPath).toLowerCase();
    }

    switch(extension) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.doc':
        contentType = 'application/msword';
        break;
      case '.docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
    }

    res.setHeader('Content-Type', contentType);
    
    if (filename) {
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    } else {
      res.setHeader('Content-Disposition', `attachment; filename="file${extension}"`);
    }

    return res.redirect(url);
  } catch (error) {
    
    res.status(500).send('Error downloading file');
  }
});
app.get('/api/vacancies', async (req, res) => {
  try {
    const [vacancies] = await pool.execute(
      'SELECT id, subject, imageUrl FROM vacancies ORDER BY createdAt DESC'
    );
    res.json(vacancies);
  } catch (error) {
    console.error('Error fetching vacancies:', error);
    res.status(500).json({ message: 'Error fetching vacancies' });
  }
});

// === MODIFIED: Admin API Routes for Vacancies (Authentication Removed) ===

// GET all vacancies for the admin panel
app.get('/api/admin/vacancies', async (req, res) => { // <-- authenticateAdmin removed
    try {
      const [vacancies] = await pool.execute(
        'SELECT id, subject, imageUrl, createdAt FROM vacancies ORDER BY id DESC'
      );
      res.json(vacancies);
    } catch (error) {
      console.error('Error fetching vacancies for admin:', error);
      res.status(500).json({ message: 'Server error' });
    }
});

// POST a new vacancy
app.post('/api/admin/vacancies', upload.single('image'), async (req, res) => { // <-- authenticateAdmin removed
    const { subject } = req.body;
    const file = req.file;

    if (!subject || !file) {
        return res.status(400).json({ message: 'Subject and image are required.' });
    }

    try {
        const imageKitResult = await imagekit.upload({
            file: file.buffer,
            fileName: file.originalname,
            folder: "vacancies",
        });

        const [result] = await pool.execute(
            'INSERT INTO vacancies (subject, imageUrl, imageFileId) VALUES (?, ?, ?)',
            [subject, imageKitResult.url, imageKitResult.fileId]
        );

        res.status(201).json({
            id: result.insertId,
            subject,
            imageUrl: imageKitResult.url
        });
    } catch (error) {
        console.error('Error creating vacancy:', error);
        res.status(500).json({ message: 'Failed to create vacancy' });
    }
});

app.put('/api/admin/vacancies/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { subject } = req.body;
    const file = req.file;

    if (!subject) {
        return res.status(400).json({ message: 'Subject is required.' });
    }

    try {
        const connection = await pool.getConnection();

        // If a new file is uploaded, we need to update the image
        if (file) {
            // 1. Get the old imageFileId to delete it from ImageKit later
            const [currentVacancy] = await connection.execute('SELECT imageFileId FROM vacancies WHERE id = ?', [id]);
            if (currentVacancy.length === 0) {
                connection.release();
                return res.status(404).json({ message: 'Vacancy not found' });
            }
            const oldImageFileId = currentVacancy[0].imageFileId;

            // 2. Upload the new image to ImageKit
            const newImageResult = await imagekit.upload({
                file: file.buffer,
                fileName: file.originalname,
                folder: "vacancies",
            });

            // 3. Update the database with new subject, imageUrl, and imageFileId
            await connection.execute(
                'UPDATE vacancies SET subject = ?, imageUrl = ?, imageFileId = ? WHERE id = ?',
                [subject, newImageResult.url, newImageResult.fileId, id]
            );

            // 4. Delete the old image from ImageKit
            if (oldImageFileId) {
                await imagekit.deleteFile(oldImageFileId);
            }

        } else {
            // If no new file, just update the subject
            await connection.execute(
                'UPDATE vacancies SET subject = ? WHERE id = ?',
                [subject, id]
            );
        }

        connection.release();
        res.status(200).json({ message: 'Vacancy updated successfully.' });

    } catch (error) {
        console.error('Error updating vacancy:', error);
        res.status(500).json({ message: 'Failed to update vacancy.' });
    }
});
// DELETE a vacancy
app.delete('/api/admin/vacancies/:id', async (req, res) => { // <-- authenticateAdmin removed
    const { id } = req.params;
    try {
        const [rows] = await pool.execute('SELECT imageFileId FROM vacancies WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Vacancy not found' });
        }
        const { imageFileId } = rows[0];
        
        await imagekit.deleteFile(imageFileId);
        await pool.execute('DELETE FROM vacancies WHERE id = ?', [id]);
        
        res.status(200).json({ message: 'Vacancy deleted successfully' });
    } catch (error) {
        console.error(`Error deleting vacancy ${id}:`, error);
        res.status(500).json({ message: 'Failed to delete vacancy' });
    }
});

// Admin authentication routes
app.post('/admin/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO admin_users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );
    res.status(201).json({ message: 'Admin user registered' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

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
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (err) {
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Form entries route with column existence check
app.get('/admin/form-entries', async (req, res) => {
  try {
    // First check if the column exists
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'form_entries' 
      AND COLUMN_NAME = 'originalFilename'
    `);

    const hasOriginalFilename = columns.length > 0;
    
    let baseQuery = hasOriginalFilename 
      ? 'SELECT *, originalFilename FROM form_entries'
      : 'SELECT * FROM form_entries';
      
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
    let clientIP =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.connection?.socket?.remoteAddress;

    // fallback if localhost (dev mode)
    if (clientIP === '::1' || clientIP === '127.0.0.1') {
      clientIP = '8.8.8.8';
    }

   

    const { data } = await axios.get(`https://freeipapi.com/api/json/${clientIP}`);
    

    res.json(data);
  } catch (err) {
   
    res.status(500).json({ error: 'Failed to fetch IP info' });
  }
});

// ImageKit authentication endpoint (for client-side uploads if needed)
app.get('/imagekit-auth', (req, res) => {
  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    res.json(authenticationParameters);
  } catch (err) {
    
    res.status(500).send('Error generating auth parameters');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  pool.getConnection()
    .then(connection => {
      connection.release();
      res.status(200).json({ status: 'healthy', database: 'connected' });
    })
    .catch(err => {
      res.status(500).json({ status: 'unhealthy', database: 'disconnected' });
    });
});

app.get('/', (req, res) => {
  res.send('Server is working!');
});

// Error handling middleware
app.use((err, req, res, next) => {

  res.status(500).send('Internal Server Error');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});