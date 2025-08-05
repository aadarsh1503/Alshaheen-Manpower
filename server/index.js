const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');

console.log('ImageKit public keysssss:', process.env.IMAGEKIT_PUBLIC_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));


// Route Imports
const publicRoutes = require('./routes/publicRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Database Connection Check
pool.getConnection()
  .then(connection => {
    console.log('✅ Successfully connected to MySQL database.');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });

// --- API Routes ---
app.use('/api', publicRoutes);
app.use('/admin', authRoutes);
app.use('/api/admin', adminRoutes);

// --- Root and Error Handling ---
app.get('/', (req, res) => {
  res.send('Alshaheen Manpower API Server is running!');
});

app.use((err, req, res, next) => {
  // Check if the error is a CORS error
  if (err.message === 'Not allowed by CORS') {
    console.warn(`CORS Blocked: A request from origin '${req.header('origin')}' was blocked.`);
    res.status(403).json({ message: 'This origin is not authorized to access this resource.' });
  } else {
    // Handle other server errors
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
  }
});



// // Error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Internal Server Error');
// });

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});