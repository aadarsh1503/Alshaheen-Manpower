const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/db');
const { sendPasswordResetEmail } = require('../utils/emailService'); // Import the email service
require('dotenv').config();

// signupAdmin and loginAdmin functions remain the same...

const signupAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.execute('INSERT INTO admin_users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    res.status(201).json({ message: 'Admin user registered successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'An admin with this email already exists' });
    }
    console.error('Admin signup error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [results] = await pool.execute('SELECT * FROM admin_users WHERE email = ?', [email]);
    
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_secret',
      { expiresIn: '8h' }
    );
    res.json({ token });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// NEW: Forgot Password Function
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const [results] = await pool.execute('SELECT * FROM admin_users WHERE email = ?', [email]);

    if (results.length === 0) {
      // Important: Do not reveal if an email exists or not for security.
      return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    const user = results[0];

    // Generate a token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token expiration (e.g., 1 hour)
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);

    // Save the hashed token and expiration date to the database
    await pool.execute(
      'UPDATE admin_users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?',
      [hashedToken, expirationDate, user.id]
    );

    // Send the email (with the unhashed token)
    await sendPasswordResetEmail(user.email, resetToken);
    
    res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'An error occurred while trying to send the reset link.' });
  }
};

// NEW: Reset Password Function
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash the incoming token to match the one in the database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const [results] = await pool.execute(
      'SELECT * FROM admin_users WHERE reset_password_token = ? AND reset_password_expires > NOW()',
      [hashedToken]
    );

    if (results.length === 0) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    const user = results[0];

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and clear the reset token fields
    await pool.execute(
      'UPDATE admin_users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    res.status(200).json({ message: 'Password has been successfully reset.' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'An error occurred while resetting the password.' });
  }
};

// NEW: Change Password (for logged-in admin)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId; // From auth middleware

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    // Get user from database
    const [results] = await pool.execute('SELECT * FROM admin_users WHERE id = ?', [userId]);
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.execute('UPDATE admin_users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    res.status(200).json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'An error occurred while changing the password' });
  }
};


module.exports = {
  signupAdmin,
  loginAdmin,
  forgotPassword, // Export new function
  resetPassword,  // Export new function
  changePassword, // Export new function
};