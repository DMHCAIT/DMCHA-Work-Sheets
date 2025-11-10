const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * Get dashboard statistics (filtered by role)
 */
const getDashboardStats = async (req, res) => {
  try {
    const user = req.user;

    // Base filters based on role
    let worksheetFilter = '';
    let reportFilter = '';
    let userFilter = '';
    const params = [];
    let paramCount = 1;

    if (user.role_name === 'Employee') {
      // Employees see only their own data
      worksheetFilter = ` WHERE (created_by = $${paramCount} OR assigned_to = $${paramCount})`;
      reportFilter = ` WHERE created_by = $${paramCount}`;
      params.push(user.id);
      paramCount++;
    } else if (user.role_name === 'Department Manager') {
      // Department Managers see their department's data
      worksheetFilter = ` WHERE department_id = $${paramCount}`;
      reportFilter = ` WHERE department_id = $${paramCount}`;
      userFilter = ` WHERE department_id = $${paramCount}`;
      params.push(user.department_id);
      paramCount++;
    }
    // Admin and Auditor see all data

    // Get worksheet statistics
    const worksheetStatsQuery = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'draft') as draft,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'approved') as approved,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
        COUNT(*) FILTER (WHERE priority = 'urgent') as urgent,
        COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND status NOT IN ('completed', 'approved')) as overdue
      FROM worksheets${worksheetFilter}
    `;

    const worksheetStats = await db.query(worksheetStatsQuery, params.slice(0, paramCount - 1));

    // Get report statistics
    const reportStatsQuery = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'draft') as draft,
        COUNT(*) FILTER (WHERE status = 'submitted') as submitted,
        COUNT(*) FILTER (WHERE status = 'approved') as approved,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
        COUNT(*) FILTER (WHERE report_type = 'daily') as daily,
        COUNT(*) FILTER (WHERE report_type = 'weekly') as weekly,
        COUNT(*) FILTER (WHERE report_type = 'monthly') as monthly
      FROM reports${reportFilter}
    `;

    const reportStats = await db.query(reportStatsQuery, params.slice(0, paramCount - 1));

    // Get user statistics (only for Admin and Managers)
    let userStats = { total: 0, active: 0, inactive: 0 };
    if (['Admin', 'Department Manager'].includes(user.role_name)) {
      const userStatsQuery = `
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'active') as active,
          COUNT(*) FILTER (WHERE status = 'inactive') as inactive
        FROM users${userFilter}
      `;

      const userStatsResult = await db.query(userStatsQuery, params.slice(0, paramCount - 1));
      userStats = userStatsResult.rows[0];
    }

    // Get recent activity
    let activityFilter = '';
    if (user.role_name === 'Employee') {
      activityFilter = ` WHERE user_id = $${paramCount}`;
      params.push(user.id);
    } else if (user.role_name === 'Department Manager') {
      activityFilter = ` WHERE user_id IN (SELECT id FROM users WHERE department_id = $${paramCount})`;
      params.push(user.department_id);
    }

    const activityQuery = `
      SELECT 
        al.*,
        u.first_name || ' ' || u.last_name as user_name
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ${activityFilter}
      ORDER BY al.created_at DESC
      LIMIT 10
    `;

    const activityResult = await db.query(activityQuery, params.slice(paramCount - 1));

    res.json({
      success: true,
      data: {
        worksheets: worksheetStats.rows[0],
        reports: reportStats.rows[0],
        users: userStats,
        recent_activity: activityResult.rows
      }
    });
  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

/**
 * Get department-specific dashboard
 */
const getDepartmentDashboard = async (req, res) => {
  try {
    const user = req.user;
    const { departmentId } = req.params;

    // Check access
    if (user.role_name === 'Department Manager' && parseInt(departmentId) !== user.department_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only access your own department dashboard'
      });
    }

    if (user.role_name === 'Employee') {
      return res.status(403).json({
        success: false,
        message: 'Employees do not have access to department dashboards'
      });
    }

    // Get department info
    const deptInfo = await db.query(
      `SELECT d.*, u.first_name || ' ' || u.last_name as manager_name
       FROM departments d
       LEFT JOIN users u ON d.manager_id = u.id
       WHERE d.id = $1`,
      [departmentId]
    );

    if (deptInfo.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Get department stats
    const worksheetStats = await db.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        AVG(progress) as avg_progress
       FROM worksheets
       WHERE department_id = $1`,
      [departmentId]
    );

    const reportStats = await db.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'submitted') as submitted,
        COUNT(*) FILTER (WHERE status = 'approved') as approved
       FROM reports
       WHERE department_id = $1`,
      [departmentId]
    );

    const employeeCount = await db.query(
      `SELECT COUNT(*) as total FROM users WHERE department_id = $1 AND status = 'active'`,
      [departmentId]
    );

    res.json({
      success: true,
      data: {
        department: deptInfo.rows[0],
        worksheets: worksheetStats.rows[0],
        reports: reportStats.rows[0],
        employees: employeeCount.rows[0]
      }
    });
  } catch (error) {
    logger.error('Get department dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch department dashboard',
      error: error.message
    });
  }
};

/**
 * Get chart data for trends (last 30 days)
 */
const getChartData = async (req, res) => {
  try {
    const user = req.user;
    const { type } = req.query; // 'worksheets' or 'reports'

    let filter = '';
    const params = [];
    let paramCount = 1;

    if (user.role_name === 'Employee') {
      filter = ` AND (created_by = $${paramCount} OR assigned_to = $${paramCount})`;
      params.push(user.id);
      paramCount++;
    } else if (user.role_name === 'Department Manager') {
      filter = ` AND department_id = $${paramCount}`;
      params.push(user.department_id);
      paramCount++;
    }

    let query;
    if (type === 'reports') {
      query = `
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count,
          COUNT(*) FILTER (WHERE status = 'approved') as approved
        FROM reports
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'${filter}
        GROUP BY DATE(created_at)
        ORDER BY date
      `;
    } else {
      query = `
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count,
          COUNT(*) FILTER (WHERE status = 'completed' OR status = 'approved') as completed
        FROM worksheets
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'${filter}
        GROUP BY DATE(created_at)
        ORDER BY date
      `;
    }

    const result = await db.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Get chart data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chart data',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getDepartmentDashboard,
  getChartData
};
