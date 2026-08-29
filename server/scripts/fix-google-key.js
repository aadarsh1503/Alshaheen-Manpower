require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const db = require('../config/db');
(async () => {
  const key = process.env.GOOGLE_PRIVATE_KEY;
  if (!key || key.length < 100) {
    console.error('❌ GOOGLE_PRIVATE_KEY not found or too short in .env');
    process.exit(1);
  }
  await db.query(
    "INSERT INTO site_settings (setting_key, setting_value) VALUES ('google_private_key', ?) ON DUPLICATE KEY UPDATE setting_value = ?",
    [key, key]
  );
  console.log('✅ google_private_key fixed. Length:', key.length);
  process.exit(0);
})();
