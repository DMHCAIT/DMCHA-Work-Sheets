const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const reportController = require('../controllers/report.controller');

/**
 * @route   GET /api/reports
 * @desc    Get reports (filtered by role/department)
 * @access  Private
 */
router.get('/', authenticate, authorize('reports', 'read'), reportController.getReports);

/**
 * @route   POST /api/reports
 * @desc    Create/submit new report
 * @access  Private
 */
router.post('/', authenticate, authorize('reports', 'create'), reportController.createReport);

/**
 * @route   GET /api/reports/:id
 * @desc    Get report by ID
 * @access  Private
 */
router.get('/:id', authenticate, authorize('reports', 'read'), reportController.getReportById);

/**
 * @route   PUT /api/reports/:id
 * @desc    Update report
 * @access  Private
 */
router.put('/:id', authenticate, authorize('reports', 'update'), reportController.updateReport);

/**
 * @route   DELETE /api/reports/:id
 * @desc    Delete report
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, reportController.deleteReport);

/**
 * @route   POST /api/reports/:id/approve
 * @desc    Approve or reject report
 * @access  Private (Manager/Admin)
 */
router.post('/:id/approve', authenticate, authorize('reports', 'approve'), reportController.approveReport);

module.exports = router;
