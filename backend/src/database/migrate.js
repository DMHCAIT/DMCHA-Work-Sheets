const { createTables, dropTables } = require('./schema');
const logger = require('../utils/logger');
const { pool } = require('../config/database');

const migrate = async () => {
  try {
    logger.info('🚀 Starting database migration...');
    
    // Drop existing tables if needed (use with caution in production)
    if (process.env.DROP_TABLES === 'true') {
      await dropTables();
    }
    
    // Create all tables
    await createTables();
    
    logger.info('✅ Database migration completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  migrate();
}

module.exports = { migrate };
