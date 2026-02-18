const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/vacancies', authenticateAdmin, adminController.getAdminVacancies);
router.post('/vacancies', authenticateAdmin, upload.single('image'), adminController.createVacancy);
router.put('/vacancies/:id', authenticateAdmin, upload.single('image'), adminController.updateVacancy);
router.delete('/vacancies/:id', authenticateAdmin, adminController.deleteVacancy);

// This route is /admin/form-entries, but we mount it under /api/admin in server.js, so the final path is /api/admin/form-entries.
// To fix this while maintaining functionality, let's redefine the route here based on the original server file.
router.get('/form-entries', authenticateAdmin, adminController.getFormEntries);
router.put('/form-entries/:id', authenticateAdmin, adminController.updateFormEntry);
router.delete('/form-entries/:id', authenticateAdmin, adminController.deleteFormEntry);
router.patch('/form-entries/:id/blacklist', authenticateAdmin, adminController.toggleBlacklist);

// Settings routes
router.get('/settings', authenticateAdmin, adminController.getSettings);
router.put('/settings', authenticateAdmin, adminController.updateSettings);

module.exports = router;