const { query } = require('../config/database');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  comparePassword,
  hashPassword,
  validatePassword,
  revokeRefreshToken,
  revokeAllUserTokens
} = require('../utils/auth');
const { createAuditLog } = require('../utils/audit');
const logger = require('../utils/logger');

/**
 * Login user
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find user
    const result = await query(
      `SELECT u.*, r.name as role_name, r.permissions, d.name as department_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE u.username = $1 AND u.is_active = true`,
      [username]
    );

    if (result.rows.length === 0) {
      logger.warn(`Failed login attempt for username: ${username}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      logger.warn(`Failed login attempt for username: ${username} (invalid password)`);
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Update last login
    await query(
      `UPDATE users SET last_login = NOW() WHERE id = $1`,
      [user.id]
    );

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user.id);

    // Create audit log
    await createAuditLog({
      userId: user.id,
      action: 'LOGIN',
      entityType: 'user',
      entityId: user.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    logger.info(`User logged in: ${username}`);

    // Remove sensitive data
    delete user.password_hash;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        accessToken,
        refreshToken,
        forcePasswordChange: user.force_password_change
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken);

    if (!decoded || decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Check if token exists in database
    const tokenResult = await query(
      `SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()`,
      [refreshToken]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired or revoked'
      });
    }

    // Get user details
    const userResult = await query(
      `SELECT u.*, r.name as role_name, r.permissions, d.name as department_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE u.id = $1 AND u.is_active = true`,
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = userResult.rows[0];

    // Generate new access token
    const accessToken = generateAccessToken(user);

    logger.info(`Token refreshed for user: ${user.username}`);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 */
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    // Create audit log
    await createAuditLog({
      userId: req.user.id,
      action: 'LOGOUT',
      entityType: 'user',
      entityId: req.user.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    logger.info(`User logged out: ${req.user.username}`);

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet requirements',
        errors: passwordValidation.errors
      });
    }

    // Get user with password hash
    const result = await query(
      `SELECT password_hash FROM users WHERE id = $1`,
      [userId]
    );

    const user = result.rows[0];

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await query(
      `UPDATE users 
       SET password_hash = $1, 
           password_changed_at = NOW(), 
           force_password_change = false,
           updated_at = NOW()
       WHERE id = $2`,
      [newPasswordHash, userId]
    );

    // Revoke all existing refresh tokens
    await revokeAllUserTokens(userId);

    // Create audit log
    await createAuditLog({
      userId,
      action: 'PASSWORD_CHANGED',
      entityType: 'user',
      entityId: userId,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    logger.info(`Password changed for user: ${req.user.username}`);

    res.json({
      success: true,
      message: 'Password changed successfully. Please login again.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password (admin only)
 */
const resetPassword = async (req, res, next) => {
  try {
    const { userId, newPassword, forceChange = true } = req.body;

    // Check if requester is admin
    if (req.user.role_name !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can reset passwords'
      });
    }

    if (!userId || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'User ID and new password are required'
      });
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet requirements',
        errors: passwordValidation.errors
      });
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    const result = await query(
      `UPDATE users 
       SET password_hash = $1, 
           password_changed_at = NOW(), 
           force_password_change = $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING username`,
      [newPasswordHash, forceChange, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Revoke all existing refresh tokens
    await revokeAllUserTokens(userId);

    // Create audit log
    await createAuditLog({
      userId: req.user.id,
      action: 'PASSWORD_RESET',
      entityType: 'user',
      entityId: userId,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    logger.info(`Password reset by admin ${req.user.username} for user: ${result.rows[0].username}`);

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT u.id, u.username, u.email, u.first_name, u.last_name, 
              u.is_active, u.last_login, u.force_password_change,
              u.created_at, u.updated_at,
              r.id as role_id, r.name as role_name, r.permissions,
              d.id as department_id, d.name as department_name,
              m.username as manager_username, 
              m.first_name as manager_first_name, 
              m.last_name as manager_last_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       LEFT JOIN departments d ON u.department_id = d.id
       LEFT JOIN users m ON u.manager_id = m.id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  refreshToken,
  logout,
  changePassword,
  resetPassword,
  getCurrentUser
};
