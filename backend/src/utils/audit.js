const { query } = require('../config/database');
const logger = require('./logger');

/**
 * Create audit log entry
 */
const createAuditLog = async ({
  userId,
  action,
  entityType,
  entityId,
  oldValues = null,
  newValues = null,
  ipAddress = null,
  userAgent = null
}) => {
  try {
    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        userId,
        action,
        entityType,
        entityId,
        oldValues ? JSON.stringify(oldValues) : null,
        newValues ? JSON.stringify(newValues) : null,
        ipAddress,
        userAgent
      ]
    );
  } catch (error) {
    logger.error('Failed to create audit log:', error);
  }
};

/**
 * Audit middleware - logs all requests
 */
const auditMiddleware = (action, entityType) => {
  return async (req, res, next) => {
    // Store original send function
    const originalSend = res.send;

    // Override send function to capture response
    res.send = function (data) {
      // Only audit successful operations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const userId = req.user?.id;
        const entityId = req.params.id || req.body?.id;
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('user-agent');

        // Create audit log asynchronously (don't block response)
        createAuditLog({
          userId,
          action,
          entityType,
          entityId,
          oldValues: req.oldValues || null,
          newValues: req.body || null,
          ipAddress,
          userAgent
        }).catch(err => {
          logger.error('Audit log creation failed:', err);
        });
      }

      // Call original send
      originalSend.call(this, data);
    };

    next();
  };
};

/**
 * Get audit logs with filters
 */
const getAuditLogs = async (filters = {}) => {
  const {
    userId,
    action,
    entityType,
    entityId,
    startDate,
    endDate,
    limit = 100,
    offset = 0
  } = filters;

  let queryText = `
    SELECT al.*, u.username, u.first_name, u.last_name
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE 1=1
  `;
  const params = [];
  let paramIndex = 1;

  if (userId) {
    queryText += ` AND al.user_id = $${paramIndex}`;
    params.push(userId);
    paramIndex++;
  }

  if (action) {
    queryText += ` AND al.action = $${paramIndex}`;
    params.push(action);
    paramIndex++;
  }

  if (entityType) {
    queryText += ` AND al.entity_type = $${paramIndex}`;
    params.push(entityType);
    paramIndex++;
  }

  if (entityId) {
    queryText += ` AND al.entity_id = $${paramIndex}`;
    params.push(entityId);
    paramIndex++;
  }

  if (startDate) {
    queryText += ` AND al.created_at >= $${paramIndex}`;
    params.push(startDate);
    paramIndex++;
  }

  if (endDate) {
    queryText += ` AND al.created_at <= $${paramIndex}`;
    params.push(endDate);
    paramIndex++;
  }

  queryText += ` ORDER BY al.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const result = await query(queryText, params);
  return result.rows;
};

module.exports = {
  createAuditLog,
  auditMiddleware,
  getAuditLogs
};
