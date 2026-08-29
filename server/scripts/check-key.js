require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const db = require('../config/db');
(async () => {
  const [rows] = await db.query("SELECT setting_value FROM site_settings WHERE setting_key = 'google_private_key'");
  const val = rows[0].setting_value;
  console.log('DB key length:', val.length);
  console.log('Has real newline:', val.includes('\n'));
  console.log('Has literal \\n:', val.includes('\\n'));
  console.log('First 80:', JSON.stringify(val.substring(0, 80)));
  console.log('Last 40:', JSON.stringify(val.substring(val.length - 40)));

  // Also test what .env gives directly
  const envKey = process.env.GOOGLE_PRIVATE_KEY;
  console.log('\nENV key length:', envKey.length);
  console.log('ENV has real newline:', envKey.includes('\n'));
  console.log('ENV first 80:', JSON.stringify(envKey.substring(0, 80)));
  process.exit(0);
})();
