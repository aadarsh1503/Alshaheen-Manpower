const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/vacancies', authenticateAdmin, adminController.getAdminVacancies);
router.post('/vacancies', authenticateAdmin, upload.single('image'), adminController.createVacancy);
router.put('/vacancies/:id', authenticateAdmin, upload.single('image'), adminController.updateVacancy);
router.delete('/vacancies/:id', authenticateAdmin, adminController.deleteVacancy);


router.get('/form-entries', authenticateAdmin, adminController.getFormEntries);

module.exports = router;