const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signupAdmin);
router.post('/login', authController.loginAdmin);
router.post('/forgot-password', authController.forgotPassword); // New route
router.post('/reset-password/:token', authController.resetPassword); // New route

module.exports = router;