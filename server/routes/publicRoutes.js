const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const upload = require('../middleware/uploadMiddleware');

router.get('/api/vacancies', publicController.getPublicVacancies);
router.post('/submit-form', upload.single('file'), publicController.submitForm);
router.get('/ipapi', publicController.getIpInfo);
router.get('/imagekit-auth', publicController.getImagekitAuth);
router.get('/health', publicController.healthCheck);

module.exports = router;