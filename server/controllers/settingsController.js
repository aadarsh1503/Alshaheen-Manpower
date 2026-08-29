const db = require('../config/db');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for news/events images
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'news-events',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }]
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Get all site settings (public)
const getSiteSettings = async (req, res) => {
  try {
    const [settings] = await db.query('SELECT * FROM site_settings');
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.setting_key] = setting.setting_value;
    });
    res.json(settingsObj);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({ message: 'Error fetching settings' });
  }
};

// Update site settings (admin only)
const updateSiteSettings = async (req, res) => {
  try {
    const settings = req.body;
    
    for (const [key, value] of Object.entries(settings)) {
      await db.query(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value, value]
      );
    }
    
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Error updating settings' });
  }
};

// Get all news/events (public - active only)
const getNewsEvents = async (req, res) => {
  try {
    const [events] = await db.query(
      'SELECT * FROM news_events WHERE is_active = TRUE ORDER BY display_order ASC'
    );
    res.json(events);
  } catch (error) {
    console.error('Error fetching news/events:', error);
    res.status(500).json({ message: 'Error fetching news/events' });
  }
};

// Get all news/events (admin - including inactive)
const getNewsEventsAdmin = async (req, res) => {
  try {
    const [events] = await db.query(
      'SELECT * FROM news_events ORDER BY display_order ASC'
    );
    res.json(events);
  } catch (error) {
    console.error('Error fetching news/events:', error);
    res.status(500).json({ message: 'Error fetching news/events' });
  }
};

// Add news/event
const addNewsEvent = async (req, res) => {
  try {
    const { heading, description, display_order } = req.body;
    const image_url = req.file ? req.file.path : null;

    if (!heading) {
      return res.status(400).json({ message: 'Heading is required' });
    }

    const [result] = await db.query(
      'INSERT INTO news_events (heading, description, image_url, display_order) VALUES (?, ?, ?, ?)',
      [heading, description, image_url, display_order || 0]
    );

    res.status(201).json({
      message: 'News/Event added successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error adding news/event:', error);
    res.status(500).json({ message: 'Error adding news/event' });
  }
};

// Update news/event
const updateNewsEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { heading, description, display_order, is_active } = req.body;
    const image_url = req.file ? req.file.path : undefined;

    // If new image is uploaded, delete old image from Cloudinary
    if (image_url) {
      const [event] = await db.query('SELECT image_url FROM news_events WHERE id = ?', [id]);
      if (event.length > 0 && event[0].image_url) {
        try {
          const urlParts = event[0].image_url.split('/');
          const publicIdWithExt = urlParts[urlParts.length - 1];
          const publicId = `news-events/${publicIdWithExt.split('.')[0]}`;
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error('Error deleting old image from Cloudinary:', err);
        }
      }
    }

    let updateFields = [];
    let values = [];

    if (heading !== undefined) {
      updateFields.push('heading = ?');
      values.push(heading);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      values.push(description);
    }
    if (image_url !== undefined) {
      updateFields.push('image_url = ?');
      values.push(image_url);
    }
    if (display_order !== undefined) {
      updateFields.push('display_order = ?');
      values.push(display_order);
    }
    if (is_active !== undefined) {
      updateFields.push('is_active = ?');
      values.push(is_active);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(id);
    const query = `UPDATE news_events SET ${updateFields.join(', ')} WHERE id = ?`;

    await db.query(query, values);

    res.json({ message: 'News/Event updated successfully' });
  } catch (error) {
    console.error('Error updating news/event:', error);
    res.status(500).json({ message: 'Error updating news/event' });
  }
};

// Delete news/event
const deleteNewsEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const [event] = await db.query('SELECT image_url FROM news_events WHERE id = ?', [id]);
    
    if (event.length > 0 && event[0].image_url) {
      try {
        const urlParts = event[0].image_url.split('/');
        const publicIdWithExt = urlParts[urlParts.length - 1];
        const publicId = `news-events/${publicIdWithExt.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error('Error deleting image from Cloudinary:', err);
      }
    }

    await db.query('DELETE FROM news_events WHERE id = ?', [id]);

    res.json({ message: 'News/Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting news/event:', error);
    res.status(500).json({ message: 'Error deleting news/event' });
  }
};

// Get Google credentials (admin only - returns masked private key)
const getGoogleCredentials = async (req, res) => {
  try {
    const keys = ['google_client_email', 'google_private_key', 'google_sheet_id', 'google_project_id', 'google_private_key_id', 'google_client_id'];
    const [rows] = await db.query(
      `SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN (${keys.map(() => '?').join(',')})`,
      keys
    );
    const result = {};
    rows.forEach(r => {
      // Never return the private key value — show placeholder so frontend can't accidentally re-save it
      if (r.setting_key === 'google_private_key') {
        result[r.setting_key] = r.setting_value ? '••••••••[KEY STORED - leave blank to keep]' : '';
        result['google_private_key_exists'] = !!r.setting_value;
      } else {
        result[r.setting_key] = r.setting_value || '';
      }
    });
    res.json(result);
  } catch (error) {
    console.error('Error fetching Google credentials:', error);
    res.status(500).json({ message: 'Error fetching Google credentials' });
  }
};

// Update Google credentials (admin only)
const updateGoogleCredentials = async (req, res) => {
  try {
    const { google_client_email, google_private_key, google_sheet_id, google_project_id, google_private_key_id, google_client_id } = req.body;
    
    const updates = { google_client_email, google_private_key, google_sheet_id, google_project_id, google_private_key_id, google_client_id };

    for (const [key, value] of Object.entries(updates)) {
      // Skip if empty or if it's the display placeholder for private key
      if (!value || value === '') continue;
      if (key === 'google_private_key' && value.startsWith('••••')) continue;
      await db.query(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value, value]
      );
    }

    res.json({ message: 'Google credentials updated successfully' });
  } catch (error) {
    console.error('Error updating Google credentials:', error);
    res.status(500).json({ message: 'Error updating Google credentials' });
  }
};

module.exports = {
  getSiteSettings,
  updateSiteSettings,
  getNewsEvents,
  getNewsEventsAdmin,
  addNewsEvent,
  updateNewsEvent,
  deleteNewsEvent,
  upload,
  getGoogleCredentials,
  updateGoogleCredentials
};
