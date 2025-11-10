const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const { getAuditLogs } = require('../utils/audit');

/**
 * @route   GET /api/audit
 * @desc    Get audit logs
 * @access  Private (Admin, Auditor)
 */
router.get('/', authenticate, requireRole(['Admin', 'Auditor']), async (req, res, next) => {
  try {
    const {
      userId,
      action,
      entityType,
      entityId,
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = req.query;

    const offset = (page - 1) * limit;

    const logs = await getAuditLogs({
      userId,
      action,
      entityType,
      entityId,
      startDate,
      endDate,
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: logs.length
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
