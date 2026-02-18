const db = require('../config/db');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'team-members',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Get all team members (public)
const getAllTeamMembers = async (req, res) => {
  try {
    const [members] = await db.query(
      'SELECT * FROM team_members WHERE is_active = TRUE ORDER BY display_order ASC'
    );
    res.json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ message: 'Error fetching team members' });
  }
};

// Get all team members including inactive (admin only)
const getAllTeamMembersAdmin = async (req, res) => {
  try {
    const [members] = await db.query(
      'SELECT * FROM team_members ORDER BY display_order ASC'
    );
    res.json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ message: 'Error fetching team members' });
  }
};

// Add new team member
const addTeamMember = async (req, res) => {
  try {
    const { name, role, display_order } = req.body;
    const image_url = req.file ? req.file.path : null;

    if (!name || !role) {
      return res.status(400).json({ message: 'Name and role are required' });
    }

    const [result] = await db.query(
      'INSERT INTO team_members (name, role, image_url, display_order) VALUES (?, ?, ?, ?)',
      [name, role, image_url, display_order || 0]
    );

    res.status(201).json({
      message: 'Team member added successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error adding team member:', error);
    res.status(500).json({ message: 'Error adding team member' });
  }
};

// Update team member
const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, display_order, is_active } = req.body;
    const image_url = req.file ? req.file.path : undefined;

    // If new image is uploaded, delete old image from Cloudinary
    if (image_url) {
      const [member] = await db.query('SELECT image_url FROM team_members WHERE id = ?', [id]);
      if (member.length > 0 && member[0].image_url) {
        try {
          // Extract public_id from Cloudinary URL
          const urlParts = member[0].image_url.split('/');
          const publicIdWithExt = urlParts[urlParts.length - 1];
          const publicId = `team-members/${publicIdWithExt.split('.')[0]}`;
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error('Error deleting old image from Cloudinary:', err);
        }
      }
    }

    // Build dynamic update query
    let updateFields = [];
    let values = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      values.push(name);
    }
    if (role !== undefined) {
      updateFields.push('role = ?');
      values.push(role);
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
    const query = `UPDATE team_members SET ${updateFields.join(', ')} WHERE id = ?`;

    await db.query(query, values);

    res.json({ message: 'Team member updated successfully' });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ message: 'Error updating team member' });
  }
};

// Delete team member
const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    // Get image URL before deleting
    const [member] = await db.query('SELECT image_url FROM team_members WHERE id = ?', [id]);
    
    if (member.length > 0 && member[0].image_url) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = member[0].image_url.split('/');
        const publicIdWithExt = urlParts[urlParts.length - 1];
        const publicId = `team-members/${publicIdWithExt.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error('Error deleting image from Cloudinary:', err);
      }
    }

    await db.query('DELETE FROM team_members WHERE id = ?', [id]);

    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ message: 'Error deleting team member' });
  }
};

module.exports = {
  getAllTeamMembers,
  getAllTeamMembersAdmin,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  upload
};
