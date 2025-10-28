const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. DEFINE YOUR ALLOWED ORIGINS (WHITELIST) ---
// These are the only URLs that will be allowed to access your API.
const allowedOrigins = [
  'http://localhost:5173',    
  'https://alshaheen.pro',       
  'https://gvs-services.vercel.app'
];

// --- 2. CONFIGURE CORS OPTIONS ---
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman, mobile apps, or server-to-server requests)
    // and requests from our whitelist.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  },
  optionsSuccessStatus: 200 // For legacy browser support
};

// --- 3. USE THE CONFIGURED CORS MIDDLEWARE ---
// Middleware
app.use(cors(corsOptions)); // Use the specific options instead of the generic one
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));


// Route Imports
const publicRoutes = require('./routes/publicRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const riderRoutes = require('./routes/riderRoutes');

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
app.use('/api/riders', riderRoutes);

// --- Root and Error Handling ---
app.get('/', (req, res) => {
  res.send('Alshaheen Manpower API Server is running!');
});

// Your custom error handler will now work perfectly with the new CORS config
app.use((err, req, res, next) => {
  // Check if the error is the one we created in our CORS options
  if (err.message === 'Not allowed by CORS') {
    console.warn(`CORS Blocked: A request from origin '${req.header('origin')}' was blocked.`);
    res.status(403).json({ message: 'This origin is not authorized to access this resource.' });
  } else {
    // Handle other server errors
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});