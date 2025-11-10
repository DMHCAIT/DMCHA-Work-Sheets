const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboard.controller');

/**
 * @route   GET /api/dashboards/stats
 * @desc    Get dashboard statistics (filtered by role)
 * @access  Private
 */
router.get('/stats', authenticate, dashboardController.getDashboardStats);

/**
 * @route   GET /api/dashboards/charts
 * @desc    Get chart data for trends
 * @access  Private
 */
router.get('/charts', authenticate, dashboardController.getChartData);

/**
 * @route   GET /api/dashboards/department/:departmentId
 * @desc    Get department-specific dashboard
 * @access  Private (Admin, Department Manager)
 */
router.get('/department/:departmentId', authenticate, dashboardController.getDepartmentDashboard);

module.exports = router;
