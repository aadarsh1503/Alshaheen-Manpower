const express = require('express');
const router = express.Router();
const {
  getAllTeamMembers,
  getAllTeamMembersAdmin,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  upload
} = require('../controllers/teamController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// Public route - get active team members
router.get('/public', getAllTeamMembers);

// Admin routes - require authentication
router.get('/admin', authenticateAdmin, getAllTeamMembersAdmin);
router.post('/admin', authenticateAdmin, upload.single('image'), addTeamMember);
router.put('/admin/:id', authenticateAdmin, upload.single('image'), updateTeamMember);
router.delete('/admin/:id', authenticateAdmin, deleteTeamMember);

module.exports = router;
