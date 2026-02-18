const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  multipleStatements: true,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Automatic reconnection settings
  acquireTimeout: 10000,
  timeout: 60000
});

// Handle pool errors gracefully
pool.on('error', (err) => {
  console.error('❌ MySQL Pool Error:', err.message);
  if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
    console.log('🔄 Connection lost, pool will automatically reconnect...');
  }
});

// Test connection and retry logic
const testConnection = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await pool.getConnection();
      console.log('✅ Database connection test successful');
      connection.release();
      return true;
    } catch (error) {
      console.error(`❌ Connection attempt ${i + 1}/${retries} failed:`, error.message);
      if (i < retries - 1) {
        console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  return false;
};

// Export both pool and test function
module.exports = pool;
module.exports.testConnection = testConnection;