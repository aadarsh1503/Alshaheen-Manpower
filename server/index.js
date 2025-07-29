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

// --- Global Middleware ---
app.use(cors());
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
app.use('/', publicRoutes);
app.use('/admin', authRoutes);
app.use('/api/admin', adminRoutes);

// --- Root and Error Handling ---
app.get('/', (req, res) => {
  res.send('Alshaheen Manpower API Server is running!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});