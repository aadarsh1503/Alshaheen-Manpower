const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

router.post('/signup', authController.signupAdmin);
router.post('/login', authController.loginAdmin);
router.post('/forgot-password', authController.forgotPassword); // New route
router.post('/reset-password/:token', authController.resetPassword); // New route
router.post('/change-password', authenticateAdmin, authController.changePassword); // New route

module.exports = router;