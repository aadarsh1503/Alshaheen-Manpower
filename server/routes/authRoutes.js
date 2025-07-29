const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signupAdmin);
router.post('/login', authController.loginAdmin);

module.exports = router;