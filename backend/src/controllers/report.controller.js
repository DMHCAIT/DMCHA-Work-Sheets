const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * Get all reports (filtered by role and department)
 */
const getReports = async (req, res) => {
  try {
    const user = req.user;
    const { status, report_type, department_id } = req.query;

    let query = `
      SELECT 
        r.*,
        u1.first_name || ' ' || u1.last_name AS created_by_name,
        d.department_name,
        u2.first_name || ' ' || u2.last_name AS approved_by_name
      FROM reports r
      LEFT JOIN users u1 ON r.created_by = u1.id
      LEFT JOIN departments d ON r.department_id = d.id
      LEFT JOIN users u2 ON r.approved_by = u2.id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    // Role-based filtering
    if (user.role_name === 'Employee') {
      // Employees see only their own reports
      query += ` AND r.created_by = $${paramCount}`;
      params.push(user.id);
      paramCount++;
    } else if (user.role_name === 'Department Manager') {
      // Department Managers see only their department's reports
      query += ` AND r.department_id = $${paramCount}`;
      params.push(user.department_id);
      paramCount++;
    }
    // Admin and Auditor see all reports

    // Additional filters
    if (status) {
      query += ` AND r.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (report_type) {
      query += ` AND r.report_type = $${paramCount}`;
      params.push(report_type);
      paramCount++;
    }

    if (department_id) {
      query += ` AND r.department_id = $${paramCount}`;
      params.push(department_id);
      paramCount++;
    }

    query += ' ORDER BY r.created_at DESC';

    const result = await db.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    logger.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error.message
    });
  }
};

/**
 * Get single report by ID
 */
const getReportById = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    let query = `
      SELECT 
        r.*,
        u1.first_name || ' ' || u1.last_name AS created_by_name,
        u1.email AS created_by_email,
        d.department_name,
        u2.first_name || ' ' || u2.last_name AS approved_by_name
      FROM reports r
      LEFT JOIN users u1 ON r.created_by = u1.id
      LEFT JOIN departments d ON r.department_id = d.id
      LEFT JOIN users u2 ON r.approved_by = u2.id
      WHERE r.id = $1
    `;

    const params = [id];

    // Role-based access check
    if (user.role_name === 'Employee') {
      query += ` AND r.created_by = $2`;
      params.push(user.id);
    } else if (user.role_name === 'Department Manager') {
      query += ` AND r.department_id = $2`;
      params.push(user.department_id);
    }

    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found or access denied'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Get report by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report',
      error: error.message
    });
  }
};

/**
 * Create/Submit new report
 */
const createReport = async (req, res) => {
  try {
    const user = req.user;
    const {
      title,
      description,
      report_type,
      department_id,
      data,
      start_date,
      end_date,
      submit
    } = req.body;

    // Validation
    if (!title || !report_type) {
      return res.status(400).json({
        success: false,
        message: 'Title and report type are required'
      });
    }

    // Use user's department if not provided or if employee
    const finalDepartmentId = user.role_name === 'Employee' 
      ? user.department_id 
      : (department_id || user.department_id);

    // Department Managers can only create for their department
    if (user.role_name === 'Department Manager' && finalDepartmentId !== user.department_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only create reports for your department'
      });
    }

    const status = submit ? 'submitted' : 'draft';
    const submitted_at = submit ? new Date() : null;

    const query = `
      INSERT INTO reports (
        title, description, report_type, created_by, department_id,
        data, start_date, end_date, status, submitted_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const params = [
      title,
      description || null,
      report_type,
      user.id,
      finalDepartmentId,
      JSON.stringify(data || {}),
      start_date || null,
      end_date || null,
      status,
      submitted_at
    ];

    const result = await db.query(query, params);

    // Log audit
    await db.query(
      'INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values) VALUES ($1, $2, $3, $4, $5)',
      [user.id, 'report.create', 'report', result.rows[0].id, JSON.stringify(result.rows[0])]
    );

    res.status(201).json({
      success: true,
      message: submit ? 'Report submitted successfully' : 'Report created as draft',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Create report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create report',
      error: error.message
    });
  }
};

/**
 * Update report
 */
const updateReport = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const {
      title,
      description,
      report_type,
      data,
      start_date,
      end_date,
      status
    } = req.body;

    // Check access
    let checkQuery = 'SELECT * FROM reports WHERE id = $1';
    const checkParams = [id];

    if (user.role_name === 'Employee') {
      checkQuery += ' AND created_by = $2';
      checkParams.push(user.id);
    } else if (user.role_name === 'Department Manager') {
      checkQuery += ' AND department_id = $2';
      checkParams.push(user.department_id);
    }

    const checkResult = await db.query(checkQuery, checkParams);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found or access denied'
      });
    }

    const oldValues = checkResult.rows[0];

    // Employees cannot update submitted reports
    if (user.role_name === 'Employee' && oldValues.status !== 'draft') {
      return res.status(403).json({
        success: false,
        message: 'Cannot update submitted reports'
      });
    }

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

    if (report_type !== undefined) {
      updates.push(`report_type = $${paramCount}`);
      params.push(report_type);
      paramCount++;
    }

    if (data !== undefined) {
      updates.push(`data = $${paramCount}`);
      params.push(JSON.stringify(data));
      paramCount++;
    }

    if (start_date !== undefined) {
      updates.push(`start_date = $${paramCount}`);
      params.push(start_date);
      paramCount++;
    }

    if (end_date !== undefined) {
      updates.push(`end_date = $${paramCount}`);
      params.push(end_date);
      paramCount++;
    }

    if (status !== undefined) {
      updates.push(`status = $${paramCount}`);
      params.push(status);
      paramCount++;

      if (status === 'submitted') {
        updates.push(`submitted_at = CURRENT_TIMESTAMP`);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    params.push(id);
    const query = `
      UPDATE reports
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, params);

    // Log audit
    await db.query(
      'INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_values, new_values) VALUES ($1, $2, $3, $4, $5, $6)',
      [user.id, 'report.update', 'report', id, JSON.stringify(oldValues), JSON.stringify(result.rows[0])]
    );

    res.json({
      success: true,
      message: 'Report updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Update report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update report',
      error: error.message
    });
  }
};

/**
 * Delete report
 */
const deleteReport = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    // Only Admin can delete
    if (user.role_name !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can delete reports'
      });
    }

    const result = await db.query(
      'DELETE FROM reports WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Log audit
    await db.query(
      'INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_values) VALUES ($1, $2, $3, $4, $5)',
      [user.id, 'report.delete', 'report', id, JSON.stringify(result.rows[0])]
    );

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    logger.error('Delete report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report',
      error: error.message
    });
  }
};

/**
 * Approve or reject report
 */
const approveReport = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { comment, action } = req.body; // action: 'approve' or 'reject'

    // Only managers and admins can approve
    if (!['Admin', 'Department Manager'].includes(user.role_name)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to approve reports'
      });
    }

    // Check if report exists and user has access
    let checkQuery = 'SELECT * FROM reports WHERE id = $1';
    const checkParams = [id];

    if (user.role_name === 'Department Manager') {
      checkQuery += ' AND department_id = $2';
      checkParams.push(user.department_id);
    }

    const checkResult = await db.query(checkQuery, checkParams);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found or access denied'
      });
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    const result = await db.query(
      `UPDATE reports 
       SET status = $1, approved_by = $2, approved_at = CURRENT_TIMESTAMP, approval_comment = $3
       WHERE id = $4
       RETURNING *`,
      [newStatus, user.id, comment || null, id]
    );

    // Log audit
    await db.query(
      'INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values) VALUES ($1, $2, $3, $4, $5)',
      [user.id, `report.${action}`, 'report', id, JSON.stringify({ status: newStatus, comment })]
    );

    res.json({
      success: true,
      message: `Report ${action}d successfully`,
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Approve report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve report',
      error: error.message
    });
  }
};

module.exports = {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  approveReport
};
