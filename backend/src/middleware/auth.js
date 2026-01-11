const jwt = require('jsonwebtoken');
const { getPool } = require('../config/database');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify user still exists and is active
    const pool = getPool();
    const [users] = await pool.execute(
      'SELECT id, username, email, role, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0 || !users[0].is_active) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    req.user = {
      id: users[0].id,
      username: users[0].username,
      email: users[0].email,
      role: users[0].role
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const pool = getPool();
      const [users] = await pool.execute(
        'SELECT id, username, email, role FROM users WHERE id = ? AND is_active = 1',
        [decoded.userId]
      );

      if (users.length > 0) {
        req.user = {
          id: users[0].id,
          username: users[0].username,
          email: users[0].email,
          role: users[0].role
        };
      }
    } catch (error) {
      // Ignore auth errors for optional auth
    }
  }

  next();
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  optionalAuth
};
