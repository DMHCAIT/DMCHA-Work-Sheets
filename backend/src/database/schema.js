const { query } = require('../config/database');
const logger = require('../utils/logger');

const createTables = async () => {
  logger.info('🔨 Creating database schema...');

  // Enable UUID extension
  await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  // 1. Departments table
  await query(`
    CREATE TABLE IF NOT EXISTS departments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Roles table
  await query(`
    CREATE TABLE IF NOT EXISTS roles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(50) NOT NULL UNIQUE,
      description TEXT,
      permissions JSONB NOT NULL DEFAULT '{}',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Users table
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username VARCHAR(50) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
      department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
      manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
      is_active BOOLEAN DEFAULT true,
      last_login TIMESTAMP,
      password_changed_at TIMESTAMP,
      force_password_change BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Refresh tokens table
  await query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token VARCHAR(500) NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Worksheet templates table
  await query(`
    CREATE TABLE IF NOT EXISTS worksheet_templates (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(200) NOT NULL,
      department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
      description TEXT,
      frequency VARCHAR(20) CHECK (frequency IN ('daily', 'weekly', 'monthly')),
      fields JSONB NOT NULL DEFAULT '[]',
      is_active BOOLEAN DEFAULT true,
      created_by UUID REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 6. Worksheets table
  await query(`
    CREATE TABLE IF NOT EXISTS worksheets (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      template_id UUID REFERENCES worksheet_templates(id) ON DELETE SET NULL,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      work_date DATE NOT NULL,
      start_time TIMESTAMP,
      end_time TIMESTAMP,
      effort_hours DECIMAL(5,2),
      status VARCHAR(20) CHECK (status IN ('draft', 'submitted', 'in_review', 'approved', 'rejected', 'revision_requested')),
      priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
      tasks JSONB DEFAULT '[]',
      blockers TEXT,
      outcomes TEXT,
      attachments JSONB DEFAULT '[]',
      submitted_at TIMESTAMP,
      reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
      reviewed_at TIMESTAMP,
      review_comments TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 7. Reports table
  await query(`
    CREATE TABLE IF NOT EXISTS reports (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(200) NOT NULL,
      report_type VARCHAR(20) CHECK (report_type IN ('weekly', 'monthly', 'quarterly', 'annual', 'custom')),
      department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      status VARCHAR(20) CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
      summary TEXT,
      data JSONB DEFAULT '{}',
      worksheet_ids UUID[],
      generated_by UUID REFERENCES users(id) ON DELETE SET NULL,
      approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
      approved_at TIMESTAMP,
      approval_comments TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 8. KPI metrics table
  await query(`
    CREATE TABLE IF NOT EXISTS kpi_metrics (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
      metric_name VARCHAR(100) NOT NULL,
      metric_type VARCHAR(50) NOT NULL,
      metric_value DECIMAL(15,2),
      target_value DECIMAL(15,2),
      unit VARCHAR(50),
      period_start DATE NOT NULL,
      period_end DATE NOT NULL,
      metadata JSONB DEFAULT '{}',
      recorded_by UUID REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 9. Notifications table
  await query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(200) NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(50) CHECK (type IN ('info', 'warning', 'error', 'success', 'reminder', 'approval', 'escalation')),
      priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
      is_read BOOLEAN DEFAULT false,
      read_at TIMESTAMP,
      action_url TEXT,
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 10. Audit logs table
  await query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      action VARCHAR(100) NOT NULL,
      entity_type VARCHAR(50) NOT NULL,
      entity_id UUID,
      old_values JSONB,
      new_values JSONB,
      ip_address VARCHAR(45),
      user_agent TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 11. Comments table
  await query(`
    CREATE TABLE IF NOT EXISTS comments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      entity_type VARCHAR(50) NOT NULL,
      entity_id UUID NOT NULL,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      is_edited BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for performance
  await query(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_users_department ON users(department_id);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_worksheets_user ON worksheets(user_id);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_worksheets_date ON worksheets(work_date);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_worksheets_status ON worksheets(status);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_reports_date_range ON reports(start_date, end_date);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_reports_department ON reports(department_id);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_kpi_metrics_department ON kpi_metrics(department_id);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_kpi_metrics_date ON kpi_metrics(period_start, period_end);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_comments_entity ON comments(entity_type, entity_id);`);

  logger.info('✅ Database schema created successfully');
};

const dropTables = async () => {
  logger.warn('🗑️  Dropping all tables...');
  
  await query(`DROP TABLE IF EXISTS comments CASCADE;`);
  await query(`DROP TABLE IF EXISTS audit_logs CASCADE;`);
  await query(`DROP TABLE IF EXISTS notifications CASCADE;`);
  await query(`DROP TABLE IF EXISTS kpi_metrics CASCADE;`);
  await query(`DROP TABLE IF EXISTS reports CASCADE;`);
  await query(`DROP TABLE IF EXISTS worksheets CASCADE;`);
  await query(`DROP TABLE IF EXISTS worksheet_templates CASCADE;`);
  await query(`DROP TABLE IF EXISTS refresh_tokens CASCADE;`);
  await query(`DROP TABLE IF EXISTS users CASCADE;`);
  await query(`DROP TABLE IF EXISTS roles CASCADE;`);
  await query(`DROP TABLE IF EXISTS departments CASCADE;`);
  
  logger.info('✅ All tables dropped');
};

module.exports = { createTables, dropTables };
