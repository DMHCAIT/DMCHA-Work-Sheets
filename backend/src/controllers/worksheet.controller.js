const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * Get all worksheets (filtered by role and department)
 */
const getWorksheets = async (req, res) => {
  try {
    const user = req.user;
    const { status, priority, department_id, assigned_to } = req.query;

    let query = `
      SELECT 
        w.*,
        u1.first_name || ' ' || u1.last_name AS created_by_name,
        u2.first_name || ' ' || u2.last_name AS assigned_to_name,
        d.department_name,
        u3.first_name || ' ' || u3.last_name AS approved_by_name
      FROM worksheets w
      LEFT JOIN users u1 ON w.created_by = u1.id
      LEFT JOIN users u2 ON w.assigned_to = u2.id
      LEFT JOIN departments d ON w.department_id = d.id
      LEFT JOIN users u3 ON w.approved_by = u3.id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    // Role-based filtering
    if (user.role_name === 'Employee') {
      // Employees see only worksheets they created or are assigned to
      query += ` AND (w.created_by = $${paramCount} OR w.assigned_to = $${paramCount})`;
      params.push(user.id);
      paramCount++;
    } else if (user.role_name === 'Department Manager') {
      // Department Managers see only their department's worksheets
      query += ` AND w.department_id = $${paramCount}`;
      params.push(user.department_id);
      paramCount++;
    }
    // Admin and Auditor see all worksheets

    // Additional filters
    if (status) {
      query += ` AND w.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (priority) {
      query += ` AND w.priority = $${paramCount}`;
      params.push(priority);
      paramCount++;
    }

    if (department_id) {
      query += ` AND w.department_id = $${paramCount}`;
      params.push(department_id);
      paramCount++;
    }

    if (assigned_to) {
      query += ` AND w.assigned_to = $${paramCount}`;
      params.push(assigned_to);
      paramCount++;
    }

    query += ' ORDER BY w.created_at DESC';

    const result = await db.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    logger.error('Get worksheets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch worksheets',
      error: error.message
    });
  }
};

/**
 * Get single worksheet by ID
 */
const getWorksheetById = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    let query = `
      SELECT 
        w.*,
        u1.first_name || ' ' || u1.last_name AS created_by_name,
        u1.email AS created_by_email,
        u2.first_name || ' ' || u2.last_name AS assigned_to_name,
        u2.email AS assigned_to_email,
        d.department_name,
        u3.first_name || ' ' || u3.last_name AS approved_by_name
      FROM worksheets w
      LEFT JOIN users u1 ON w.created_by = u1.id
      LEFT JOIN users u2 ON w.assigned_to = u2.id
      LEFT JOIN departments d ON w.department_id = d.id
      LEFT JOIN users u3 ON w.approved_by = u3.id
      WHERE w.id = $1
    `;

    const params = [id];

    // Role-based access check
    if (user.role_name === 'Employee') {
      query += ` AND (w.created_by = $2 OR w.assigned_to = $2)`;
      params.push(user.id);
    } else if (user.role_name === 'Department Manager') {
      query += ` AND w.department_id = $2`;
      params.push(user.department_id);
    }

    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Worksheet not found or access denied'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Get worksheet by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch worksheet',
      error: error.message
    });
  }
};

/**
 * Create new worksheet
 */
const createWorksheet = async (req, res) => {
  try {
    const user = req.user;
    const {
      title,
      description,
      department_id,
      assigned_to,
      priority,
      status,
      start_date,
      due_date
    } = req.body;

    // Validation
    if (!title || !department_id) {
      return res.status(400).json({
        success: false,
        message: 'Title and department are required'
      });
    }

    // Department Managers can only create for their department
    if (user.role_name === 'Department Manager' && department_id !== user.department_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only create worksheets for your department'
      });
    }

    const query = `
      INSERT INTO worksheets (
        title, description, created_by, department_id, assigned_to,
        priority, status, start_date, due_date, progress
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0)
      RETURNING *
    `;

    const params = [
      title,
      description || null,
      user.id,
      department_id,
      assigned_to || null,
      priority || 'medium',
      status || 'draft',
      start_date || null,
      due_date || null
    ];

    const result = await db.query(query, params);

    // Log audit
    await db.query(
      'INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values) VALUES ($1, $2, $3, $4, $5)',
      [user.id, 'worksheet.create', 'worksheet', result.rows[0].id, JSON.stringify(result.rows[0])]
    );

    res.status(201).json({
      success: true,
      message: 'Worksheet created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Create worksheet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create worksheet',
      error: error.message
    });
  }
};

/**
 * Update worksheet
 */
const updateWorksheet = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const {
      title,
      description,
      assigned_to,
      priority,
      status,
      progress,
      start_date,
      due_date
    } = req.body;

    // Check access
    let checkQuery = 'SELECT * FROM worksheets WHERE id = $1';
    const checkParams = [id];

    if (user.role_name === 'Employee') {
      checkQuery += ' AND (created_by = $2 OR assigned_to = $2)';
      checkParams.push(user.id);
    } else if (user.role_name === 'Department Manager') {
      checkQuery += ' AND department_id = $2';
      checkParams.push(user.department_id);
    }

    const checkResult = await db.query(checkQuery, checkParams);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Worksheet not found or access denied'
      });
    }

    const oldValues = checkResult.rows[0];

    // Build update query
    const updates = [];
    const params = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount}`);
      params.push(title);
      paramCount++;
    }

    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      params.push(description);
      paramCount++;
    }

    if (assigned_to !== undefined) {
      updates.push(`assigned_to = $${paramCount}`);
      params.push(assigned_to);
      paramCount++;
    }

    if (priority !== undefined) {
      updates.push(`priority = $${paramCount}`);
      params.push(priority);
      paramCount++;
    }

    if (status !== undefined) {
      updates.push(`status = $${paramCount}`);
      params.push(status);
      paramCount++;

      // If status is completed, set completed_at
      if (status === 'completed') {
        updates.push(`completed_at = CURRENT_TIMESTAMP`);
      }
    }

    if (progress !== undefined) {
      updates.push(`progress = $${paramCount}`);
      params.push(progress);
      paramCount++;
    }

    if (start_date !== undefined) {
      updates.push(`start_date = $${paramCount}`);
      params.push(start_date);
      paramCount++;
    }

    if (due_date !== undefined) {
      updates.push(`due_date = $${paramCount}`);
      params.push(due_date);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    params.push(id);
    const query = `
      UPDATE worksheets
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, params);

    // Log audit
    await db.query(
      'INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_values, new_values) VALUES ($1, $2, $3, $4, $5, $6)',
      [user.id, 'worksheet.update', 'worksheet', id, JSON.stringify(oldValues), JSON.stringify(result.rows[0])]
    );

    res.json({
      success: true,
      message: 'Worksheet updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Update worksheet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update worksheet',
      error: error.message
    });
  }
};

/**
 * Delete worksheet
 */
const deleteWorksheet = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    // Only Admin can delete
    if (user.role_name !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can delete worksheets'
      });
    }

    const result = await db.query(
      'DELETE FROM worksheets WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Worksheet not found'
      });
    }

    // Log audit
    await db.query(
      'INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_values) VALUES ($1, $2, $3, $4, $5)',
      [user.id, 'worksheet.delete', 'worksheet', id, JSON.stringify(result.rows[0])]
    );

    res.json({
      success: true,
      message: 'Worksheet deleted successfully'
    });
  } catch (error) {
    logger.error('Delete worksheet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete worksheet',
      error: error.message
    });
  }
};

/**
 * Submit worksheet for approval
 */
const submitWorksheet = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    // Check if user owns this worksheet
    const checkResult = await db.query(
      'SELECT * FROM worksheets WHERE id = $1 AND created_by = $2',
      [id, user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Worksheet not found or you do not have permission to submit it'
      });
    }

    const result = await db.query(
      'UPDATE worksheets SET status = $1 WHERE id = $2 RETURNING *',
      ['pending', id]
    );

    // Log audit
    await db.query(
      'INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values) VALUES ($1, $2, $3, $4, $5)',
      [user.id, 'worksheet.submit', 'worksheet', id, JSON.stringify({ status: 'pending' })]
    );

    res.json({
      success: true,
      message: 'Worksheet submitted for approval',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Submit worksheet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit worksheet',
      error: error.message
    });
  }
};

/**
 * Approve or reject worksheet
 */
const approveWorksheet = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { comment, action } = req.body; // action: 'approve' or 'reject'

    // Only managers and admins can approve
    if (!['Admin', 'Department Manager'].includes(user.role_name)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to approve worksheets'
      });
    }

    // Check if worksheet exists and user has access
    let checkQuery = 'SELECT * FROM worksheets WHERE id = $1';
    const checkParams = [id];

    if (user.role_name === 'Department Manager') {
      checkQuery += ' AND department_id = $2';
      checkParams.push(user.department_id);
    }

    const checkResult = await db.query(checkQuery, checkParams);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Worksheet not found or access denied'
      });
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    const result = await db.query(
      `UPDATE worksheets 
       SET status = $1, approved_by = $2, approved_at = CURRENT_TIMESTAMP, approval_comment = $3
       WHERE id = $4
       RETURNING *`,
      [newStatus, user.id, comment || null, id]
    );

    // Log audit
    await db.query(
      'INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values) VALUES ($1, $2, $3, $4, $5)',
      [user.id, `worksheet.${action}`, 'worksheet', id, JSON.stringify({ status: newStatus, comment })]
    );

    res.json({
      success: true,
      message: `Worksheet ${action}d successfully`,
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Approve worksheet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve worksheet',
      error: error.message
    });
  }
};

module.exports = {
  getWorksheets,
  getWorksheetById,
  createWorksheet,
  updateWorksheet,
  deleteWorksheet,
  submitWorksheet,
  approveWorksheet
};
