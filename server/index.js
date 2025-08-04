const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const pool = require('./config/db');

// Route Imports
const publicRoutes = require('./routes/publicRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


const allowedOrigins = [
  'http://localhost:5173',          
  'https://gvs-services.vercel.app',  
  'https://alshaheen.pro'         
];

// Create the CORS options object
const corsOptions = {
  origin: (origin, callback) => {
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, 
  optionsSuccessStatus: 200 // For legacy browser support
};



app.use(cors(corsOptions)); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- Database Connection Check ---
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

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});