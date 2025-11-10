const db = require('../config/database');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');

/**
 * Get all users (filtered by role)
 */
const getUsers = async (req, res) => {
  try {
    const user = req.user;
    const { role_id, department_id, status } = req.query;

    let query = `
      SELECT 
        u.id, u.username, u.email, u.first_name, u.last_name,
        u.name, u.phone, u.status, u.last_login, u.created_at,
        r.role_name, r.id as role_id,
        d.department_name, d.id as department_id
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    // Role-based filtering
    if (user.role_name === 'Department Manager') {
      // Department Managers see only their department users
      query += ` AND u.department_id = $${paramCount}`;
      params.push(user.department_id);
      paramCount++;
    }
    // Admin sees all users
    // Employees don't have access to this endpoint (handled by route protection)

    // Additional filters
    if (role_id) {
      query += ` AND u.role_id = $${paramCount}`;
      params.push(role_id);
      paramCount++;
    }

    if (department_id) {
      query += ` AND u.department_id = $${paramCount}`;
      params.push(department_id);
      paramCount++;
    }

    if (status) {
      query += ` AND u.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += ' ORDER BY u.created_at DESC';

    const result = await db.query(query, params);

    // Remove sensitive data
    const users = result.rows.map(u => {
      const { password_hash, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });

    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

/**
 * Get single user by ID
 */
const getUserById = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    let query = `
      SELECT 
        u.id, u.username, u.email, u.first_name, u.last_name,
        u.name, u.phone, u.status, u.last_login, u.created_at,
        r.role_name, r.id as role_id,
        d.department_name, d.id as department_id
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE u.id = $1
    `;

    const params = [id];

    // Role-based access check
    if (user.role_name === 'Department Manager') {
      query += ` AND u.department_id = $2`;
      params.push(user.department_id);
    }

    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found or access denied'
      });
    }

    const { password_hash, ...userWithoutPassword } = result.rows[0];

    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    logger.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

/**
 * Create new user
 */
const createUser = async (req, res) => {
  try {
    const user = req.user;
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      phone,
      role_id,
      department_id,
      status
    } = req.body;

    // Only Admin can create users
    if (user.role_name !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can create users'
      });
    }

    // Validation
    if (!username || !email || !password || !first_name || !last_name || !role_id) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, password, first name, last name, and role are required'
      });
    }

    // Check if username or email already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Username or email already exists'
      });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO users (
        username, email, password_hash, first_name, last_name,
        phone, role_id, department_id, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, username, email, first_name, last_name, name, phone, role_id, department_id, status, created_at
    `;

    const params = [
      username,
      email,
      password_hash,
      first_name,
      last_name,
      phone || null,
      role_id,
      department_id || null,
      status || 'active'
    ];

    const result = await db.query(query, params);

    // Log audit
    await db.query(
      'INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values) VALUES ($1, $2, $3, $4, $5)',
      [user.id, 'user.create', 'user', result.rows[0].id, JSON.stringify(result.rows[0])]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
};

/**
 * Update user
 */
const updateUser = async (req, res) => {
  try {
    const currentUser = req.user;
    const { id } = req.params;
    const {
      email,
      first_name,
      last_name,
      phone,
      role_id,
      department_id,
      status,
      password
    } = req.body;

    // Check if user exists and currentUser has access
    let checkQuery = 'SELECT * FROM users WHERE id = $1';
    const checkParams = [id];

    if (currentUser.role_name === 'Department Manager') {
      checkQuery += ' AND department_id = $2';
      checkParams.push(currentUser.department_id);
    }

    const checkResult = await db.query(checkQuery, checkParams);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found or access denied'
      });
    }

    const oldValues = checkResult.rows[0];

    // Department Managers cannot change roles
    if (currentUser.role_name === 'Department Manager' && role_id !== undefined) {
      return res.status(403).json({
        success: false,
        message: 'Department Managers cannot change user roles'
      });
    }

    // Build update query
    const updates = [];
    const params = [];
    let paramCount = 1;

    if (email !== undefined) {
      // Check if email is already taken by another user
      const emailCheck = await db.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, id]
      );
      if (emailCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      }
      updates.push(`email = $${paramCount}`);
      params.push(email);
      paramCount++;
    }

    if (first_name !== undefined) {
      updates.push(`first_name = $${paramCount}`);
      params.push(first_name);
      paramCount++;
    }

    if (last_name !== undefined) {
      updates.push(`last_name = $${paramCount}`);
      params.push(last_name);
      paramCount++;
    }

    if (phone !== undefined) {
      updates.push(`phone = $${paramCount}`);
      params.push(phone);
      paramCount++;
    }

    if (role_id !== undefined && currentUser.role_name === 'Admin') {
      updates.push(`role_id = $${paramCount}`);
      params.push(role_id);
      paramCount++;
    }

    if (department_id !== undefined && currentUser.role_name === 'Admin') {
      updates.push(`department_id = $${paramCount}`);
      params.push(department_id);
      paramCount++;
    }

    if (status !== undefined) {
      updates.push(`status = $${paramCount}`);
      params.push(status);
      paramCount++;
    }

    if (password !== undefined) {
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      const password_hash = await bcrypt.hash(password, saltRounds);
      updates.push(`password_hash = $${paramCount}`);
      params.push(password_hash);
      paramCount++;
      updates.push(`password_changed_at = CURRENT_TIMESTAMP`);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    params.push(id);
    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, username, email, first_name, last_name, name, phone, role_id, department_id, status, created_at
    `;

    const result = await db.query(query, params);

    // Log audit
    await db.query(
      'INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_values, new_values) VALUES ($1, $2, $3, $4, $5, $6)',
      [currentUser.id, 'user.update', 'user', id, JSON.stringify(oldValues), JSON.stringify(result.rows[0])]
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

/**
 * Delete user
 */
const deleteUser = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    // Only Admin can delete
    if (user.role_name !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can delete users'
      });
    }

    // Cannot delete yourself
    if (parseInt(id) === user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const result = await db.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Log audit
    await db.query(
      'INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_values) VALUES ($1, $2, $3, $4, $5)',
      [user.id, 'user.delete', 'user', id, JSON.stringify(result.rows[0])]
    );

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

/**
 * Get departments list
 */
const getDepartments = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, department_name, description FROM departments ORDER BY department_name'
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Get departments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch departments',
      error: error.message
    });
  }
};

/**
 * Get roles list
 */
const getRoles = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, role_name, description FROM roles ORDER BY role_name'
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Get roles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roles',
      error: error.message
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getDepartments,
  getRoles
};
