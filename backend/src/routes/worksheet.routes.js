const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const worksheetController = require('../controllers/worksheet.controller');

/**
 * @route   GET /api/worksheets
 * @desc    Get worksheets (filtered by user/department)
 * @access  Private
 */
router.get('/', authenticate, authorize('worksheets', 'read'), worksheetController.getWorksheets);

/**
 * @route   POST /api/worksheets
 * @desc    Create new worksheet
 * @access  Private
 */
router.post('/', authenticate, authorize('worksheets', 'create'), worksheetController.createWorksheet);

/**
 * @route   GET /api/worksheets/:id
 * @desc    Get worksheet by ID
 * @access  Private
 */
router.get('/:id', authenticate, authorize('worksheets', 'read'), worksheetController.getWorksheetById);

/**
 * @route   PUT /api/worksheets/:id
 * @desc    Update worksheet
 * @access  Private
 */
router.put('/:id', authenticate, authorize('worksheets', 'update'), worksheetController.updateWorksheet);

/**
 * @route   DELETE /api/worksheets/:id
 * @desc    Delete worksheet
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, worksheetController.deleteWorksheet);

/**
 * @route   POST /api/worksheets/:id/submit
 * @desc    Submit worksheet for approval
 * @access  Private
 */
router.post('/:id/submit', authenticate, authorize('worksheets', 'update'), worksheetController.submitWorksheet);

/**
 * @route   POST /api/worksheets/:id/approve
 * @desc    Approve or reject worksheet
 * @access  Private (Manager/Admin)
 */
router.post('/:id/approve', authenticate, authorize('worksheets', 'approve'), worksheetController.approveWorksheet);

module.exports = router;
