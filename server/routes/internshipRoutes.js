const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const enhancedInternshipController = require('../controllers/enhancedInternshipController');
const { authenticateAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024 // 1MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and images are allowed.'));
    }
  }
});

// Public route - Submit internship application
router.post('/submit', upload.single('resume'), internshipController.submitInternshipApplication);

// Admin routes - Protected
router.get('/applications', authenticateAdmin, internshipController.getInternshipApplications);
router.patch('/applications/:id/stage', authenticateAdmin, internshipController.updateApplicationStage);
router.post('/applications/:id/interview', authenticateAdmin, internshipController.sendInterviewInvitation);
router.delete('/applications/:id', authenticateAdmin, internshipController.deleteInternshipApplication);
router.post('/applications/bulk-delete', authenticateAdmin, internshipController.bulkDeleteApplications);
router.get('/export', authenticateAdmin, internshipController.exportToExcel);

// Enhanced email routes
router.post('/applications/:id/send-stage-email', authenticateAdmin, enhancedInternshipController.sendStageUpdateEmail);
router.post('/applications/bulk-send-email', authenticateAdmin, enhancedInternshipController.sendBulkStageUpdateEmail);
router.post('/applications/send-custom-email', authenticateAdmin, enhancedInternshipController.sendCustomEmail);
router.post('/upload-certificate', authenticateAdmin, upload.single('certificate'), enhancedInternshipController.uploadCertificate);

module.exports = router;
