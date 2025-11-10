const { verifyToken } = require('../utils/auth');
const { query } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Authentication middleware - verifies JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Get user details from database
    const result = await query(
      `SELECT u.*, r.name as role_name, r.permissions, d.name as department_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE u.id = $1 AND u.is_active = true`,
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Attach user to request
    req.user = result.rows[0];
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

/**
 * Authorization middleware - checks permissions
 * @param {string} resource - Resource name (e.g., 'worksheets', 'reports')
 * @param {string} action - Action name (e.g., 'create', 'read', 'update', 'delete')
 */
const authorize = (resource, action) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Admin has all permissions
      if (user.role_name === 'Admin') {
        return next();
      }

      // Check if user has permission
      const permissions = user.permissions || {};
      const resourcePermissions = permissions[resource] || [];

      if (!resourcePermissions.includes(action)) {
        logger.warn(`Unauthorized access attempt by ${user.username} to ${resource}:${action}`);
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to perform this action'
        });
      }

      next();
    } catch (error) {
      logger.error('Authorization error:', error);
      return res.status(403).json({
        success: false,
        message: 'Authorization failed'
      });
    }
  };
};

/**
 * Role-based authorization middleware
 * @param {string[]} allowedRoles - Array of role names
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(user.role_name)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - insufficient role'
      });
    }

    next();
  };
};

/**
 * Department-based authorization middleware
 * Ensures user can only access resources from their department
 */
const requireSameDepartment = (req, res, next) => {
  const user = req.user;
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Admin and Auditor can access all departments
  if (['Admin', 'Auditor'].includes(user.role_name)) {
    return next();
  }

  // Check if resource belongs to user's department
  const resourceDepartmentId = req.params.departmentId || req.body.department_id;
  
  if (resourceDepartmentId && resourceDepartmentId !== user.department_id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied - different department'
    });
  }

  next();
};

/**
 * Owner-based authorization middleware
 * Ensures user can only access their own resources (unless they have elevated permissions)
 */
const requireOwnership = (userIdField = 'user_id') => {
  return (req, res, next) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Admin, managers, and auditors can access all resources
    if (['Admin', 'Department Manager', 'Auditor'].includes(user.role_name)) {
      return next();
    }

    // Check if resource belongs to user
    const resourceUserId = req.params[userIdField] || req.body[userIdField];
    
    if (resourceUserId && resourceUserId !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - you can only access your own resources'
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
  requireRole,
  requireSameDepartment,
  requireOwnership
};
