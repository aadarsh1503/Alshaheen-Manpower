const express = require('express');
const router = express.Router();
const {
  getSiteSettings,
  updateSiteSettings,
  getNewsEvents,
  getNewsEventsAdmin,
  addNewsEvent,
  updateNewsEvent,
  deleteNewsEvent,
  upload
} = require('../controllers/settingsController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/public', getSiteSettings);
router.get('/news-events/public', getNewsEvents);

// Admin routes
router.put('/admin', authenticateAdmin, updateSiteSettings);
router.get('/news-events/admin', authenticateAdmin, getNewsEventsAdmin);
router.post('/news-events/admin', authenticateAdmin, upload.single('image'), addNewsEvent);
router.put('/news-events/admin/:id', authenticateAdmin, upload.single('image'), updateNewsEvent);
router.delete('/news-events/admin/:id', authenticateAdmin, deleteNewsEvent);

module.exports = router;
