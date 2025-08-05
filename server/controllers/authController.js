const bcrypt = require('bcrypt');
const jwt =require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();


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

module.exports = {
  signupAdmin,
  loginAdmin
};