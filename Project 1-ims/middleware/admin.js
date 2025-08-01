const { getRow } = require('../db');

/**
 * Admin authentication middleware
 * Ensures the user has admin role
 */
function requireAdmin(req, res, next) {
  try {
    // Check if user exists and has admin role
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        message: 'Authentication required',
        error: 'UNAUTHORIZED'
      });
    }

    // Get user details from database to check role
    getRow('SELECT role FROM users WHERE id = ?', [req.user.id])
      .then(user => {
        if (!user) {
          return res.status(401).json({ 
            message: 'User not found',
            error: 'USER_NOT_FOUND'
          });
        }

        if (user.role !== 'admin') {
          return res.status(403).json({ 
            message: 'Admin access required',
            error: 'INSUFFICIENT_PERMISSIONS'
          });
        }

        // Add admin flag to request
        req.isAdmin = true;
        next();
      })
      .catch(error => {
        console.error('Admin middleware error:', error);
        return res.status(500).json({ 
          message: 'Internal server error',
          error: 'ADMIN_CHECK_FAILED'
        });
      });
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: 'ADMIN_MIDDLEWARE_ERROR'
    });
  }
}

/**
 * Optional admin middleware - doesn't fail if not admin
 * Sets req.isAdmin flag for conditional logic
 */
function optionalAdmin(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      req.isAdmin = false;
      return next();
    }

    getRow('SELECT role FROM users WHERE id = ?', [req.user.id])
      .then(user => {
        req.isAdmin = user && user.role === 'admin';
        next();
      })
      .catch(error => {
        console.error('Optional admin middleware error:', error);
        req.isAdmin = false;
        next();
      });
  } catch (error) {
    console.error('Optional admin middleware error:', error);
    req.isAdmin = false;
    next();
  }
}

module.exports = {
  requireAdmin,
  optionalAdmin
}; 