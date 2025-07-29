const jwt = require('jsonwebtoken');

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_secret', (err, user) => {
    if (err) {
      console.error('JWT Verification Error:', err.message);
      return res.status(403).json({ message: 'Token is not valid.' });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateAdmin };