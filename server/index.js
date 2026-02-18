const express = require('express');
require('dotenv').config();
const pool = require('./config/db');
const { testConnection } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Route Imports
const publicRoutes = require('./routes/publicRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const riderRoutes = require('./routes/riderRoutes');
const internshipRoutes = require('./routes/internshipRoutes');

// Database Connection Check with Auto-Retry
const initializeDatabase = async () => {
  console.log('🔌 Attempting to connect to database...');
  const connected = await testConnection(5, 5000);
  
  if (!connected) {
    console.warn('⚠️  Database connection failed after retries.');
    console.warn('⚠️  Server will continue running, but database operations may fail.');
    console.warn('⚠️  The connection pool will automatically retry on next request.');
  } else {
    console.log('✅ Successfully connected to MySQL database.');
  }
};

// Initialize database connection (non-blocking)
initializeDatabase();

// Periodic connection health check (every 5 minutes)
setInterval(async () => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    console.log('💚 Database connection health check: OK');
  } catch (error) {
    console.error('💔 Database connection health check: FAILED -', error.message);
    console.log('🔄 Pool will automatically reconnect on next request...');
  }
}, 5 * 60 * 1000);

// --- API Routes ---
// Note: Your routes already start with /api here
app.use('/api', publicRoutes);
app.use('/api/admin', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/riders', riderRoutes);
app.use('/api/internships', internshipRoutes);

app.get('/', (req, res) => {
  res.send('Alshaheen Manpower API Server is running!');
});

// Database health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Simplified Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('⚠️  SIGTERM signal received: closing HTTP server');
  await pool.end();
  console.log('✅ Database pool closed');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n⚠️  SIGINT signal received: closing HTTP server');
  await pool.end();
  console.log('✅ Database pool closed');
  process.exit(0);
});