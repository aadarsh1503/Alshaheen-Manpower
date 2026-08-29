/**
 * One-time script to seed Google credentials from .env into site_settings table.
 * Run: node server/scripts/seed-google-keys.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const db = require('../config/db');

const keys = {
  google_sheet_id:      process.env.GOOGLE_SHEET_ID,
  google_project_id:    process.env.GOOGLE_PROJECT_ID,
  google_private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  google_client_email:  process.env.GOOGLE_CLIENT_EMAIL,
  google_client_id:     process.env.GOOGLE_CLIENT_ID,
  google_private_key:   process.env.GOOGLE_PRIVATE_KEY,
};

(async () => {
  try {
    for (const [key, value] of Object.entries(keys)) {
      if (!value) { console.warn(`⚠️  Skipping ${key} — not set in .env`); continue; }
      await db.query(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value, value]
      );
      console.log(`✅ ${key} saved`);
    }
    console.log('\n🎉 All Google credentials seeded into site_settings.');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    process.exit(0);
  }
})();
