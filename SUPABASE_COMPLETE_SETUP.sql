-- ============================================================
-- DMHCA WORKSHEETS PORTAL - COMPLETE DATABASE SETUP
-- FOR SUPABASE
-- ============================================================
-- This file contains both schema and seed data
-- Run this ONCE in Supabase SQL Editor
-- ============================================================

-- PART 1: CLEAN UP (Drop existing tables)
-- ============================================================
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS report_attachments CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS worksheet_assignments CASCADE;
DROP TABLE IF EXISTS worksheet_attachments CASCADE;
DROP TABLE IF EXISTS worksheets CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- ============================================================
-- PART 2: CREATE SCHEMA
-- ============================================================

-- Create Roles Table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Departments Table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    manager_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    name VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    phone VARCHAR(20),
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    last_login TIMESTAMP,
    password_changed_at TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Worksheets Table
CREATE TABLE worksheets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'in_progress', 'completed', 'approved', 'rejected')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    start_date DATE,
    due_date DATE,
    completed_at TIMESTAMP,
    approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    approval_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Worksheet Attachments Table
CREATE TABLE worksheet_attachments (
    id SERIAL PRIMARY KEY,
    worksheet_id INTEGER NOT NULL REFERENCES worksheets(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(100),
    uploaded_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Worksheet Assignments Table
CREATE TABLE worksheet_assignments (
    id SERIAL PRIMARY KEY,
    worksheet_id INTEGER NOT NULL REFERENCES worksheets(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (worksheet_id, user_id)
);

-- Create Reports Table
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'annual', 'custom')),
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
    data JSONB DEFAULT '{}',
    start_date DATE,
    end_date DATE,
    submitted_at TIMESTAMP,
    approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    approval_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Report Attachments Table
CREATE TABLE report_attachments (
    id SERIAL PRIMARY KEY,
    report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(100),
    uploaded_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Audit Logs Table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_department_id ON users(department_id);
CREATE INDEX idx_users_status ON users(status);

CREATE INDEX idx_worksheets_created_by ON worksheets(created_by);
CREATE INDEX idx_worksheets_department_id ON worksheets(department_id);
CREATE INDEX idx_worksheets_assigned_to ON worksheets(assigned_to);
CREATE INDEX idx_worksheets_status ON worksheets(status);
CREATE INDEX idx_worksheets_priority ON worksheets(priority);
CREATE INDEX idx_worksheets_due_date ON worksheets(due_date);

CREATE INDEX idx_reports_created_by ON reports(created_by);
CREATE INDEX idx_reports_department_id ON reports(department_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_report_type ON reports(report_type);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Add department manager foreign key
ALTER TABLE departments ADD CONSTRAINT fk_department_manager 
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL;

-- Create update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_worksheets_updated_at BEFORE UPDATE ON worksheets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- PART 3: INSERT SEED DATA
-- ============================================================

-- Insert Roles (password for all: password123)
INSERT INTO roles (role_name, description, permissions) VALUES
('Admin', 'Full system access', '{"all": true}'::jsonb),
('Sales Manager', 'Manage sales department', '{"sales": ["read", "write", "approve"]}'::jsonb),
('IT Manager', 'Manage IT department', '{"it": ["read", "write", "approve"]}'::jsonb),
('Marketing Manager', 'Manage marketing department', '{"marketing": ["read", "write", "approve"]}'::jsonb),
('Staff', 'Basic user access', '{"basic": ["read", "write"]}'::jsonb);

-- Insert Departments
INSERT INTO departments (department_name, description) VALUES
('Sales', 'Sales and Business Development'),
('IT', 'Information Technology'),
('Marketing', 'Marketing and Communications'),
('Administration', 'Administrative Services'),
('Operations', 'Operational Management');

-- Insert Users (password: password123, bcrypt hash)
-- Hash: $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYBqBqm3soW
INSERT INTO users (username, email, password_hash, first_name, last_name, phone, role_id, department_id, status) VALUES
('admin', 'admin@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYBqBqm3soW', 'Admin', 'User', '+1234567890', 1, 4, 'active'),
('sales.manager', 'sales.manager@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYBqBqm3soW', 'Sarah', 'Johnson', '+1234567891', 2, 1, 'active'),
('it.manager', 'it.manager@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYBqBqm3soW', 'Mike', 'Chen', '+1234567892', 3, 2, 'active'),
('marketing.manager', 'marketing.manager@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYBqBqm3soW', 'Emma', 'Davis', '+1234567893', 4, 3, 'active'),
('admin.manager', 'admin.manager@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYBqBqm3soW', 'James', 'Wilson', '+1234567894', 1, 4, 'active'),
('john.sales', 'john.sales@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYBqBqm3soW', 'John', 'Smith', '+1234567895', 5, 1, 'active'),
('lisa.sales', 'lisa.sales@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYBqBqm3soW', 'Lisa', 'Brown', '+1234567896', 5, 1, 'active'),
('jane.dev', 'jane.dev@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYBqBqm3soW', 'Jane', 'Developer', '+1234567897', 5, 2, 'active'),
('bob.ops', 'bob.ops@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYBqBqm3soW', 'Bob', 'Anderson', '+1234567898', 5, 5, 'active'),
('alice.marketing', 'alice.marketing@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYBqBqm3soW', 'Alice', 'Martinez', '+1234567899', 5, 3, 'active'),
('tom.it', 'tom.it@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYBqBqm3soW', 'Tom', 'Garcia', '+1234567800', 5, 2, 'active'),
('susan.admin', 'susan.admin@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYBqBqm3soW', 'Susan', 'Lee', '+1234567801', 5, 4, 'active'),
('david.sales', 'david.sales@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYBqBqm3soW', 'David', 'Taylor', '+1234567802', 5, 1, 'active');

-- Update department managers
UPDATE departments SET manager_id = 2 WHERE department_name = 'Sales';
UPDATE departments SET manager_id = 3 WHERE department_name = 'IT';
UPDATE departments SET manager_id = 4 WHERE department_name = 'Marketing';
UPDATE departments SET manager_id = 5 WHERE department_name = 'Administration';
UPDATE departments SET manager_id = 1 WHERE department_name = 'Operations';

-- Insert Sample Worksheets
INSERT INTO worksheets (title, description, created_by, department_id, assigned_to, priority, status, progress, start_date, due_date) VALUES
('Q4 Sales Strategy', 'Develop comprehensive Q4 sales strategy', 2, 1, 6, 'high', 'in_progress', 60, '2025-10-01', '2025-12-31'),
('Website Redesign', 'Complete website redesign project', 3, 2, 8, 'urgent', 'in_progress', 75, '2025-09-01', '2025-11-30'),
('Social Media Campaign', 'Launch new social media campaign', 4, 3, 10, 'medium', 'pending', 25, '2025-11-01', '2025-12-15'),
('Network Upgrade', 'Upgrade office network infrastructure', 3, 2, 11, 'high', 'in_progress', 40, '2025-10-15', '2025-11-20'),
('Employee Training', 'Organize Q4 employee training sessions', 5, 4, 12, 'medium', 'draft', 10, '2025-11-15', '2025-12-10'),
('Client Database Update', 'Update and clean client database', 2, 1, 7, 'low', 'completed', 100, '2025-09-01', '2025-10-31'),
('Marketing Budget Review', 'Review and optimize marketing budget', 4, 3, 10, 'medium', 'completed', 100, '2025-10-01', '2025-10-25'),
('IT Security Audit', 'Conduct comprehensive security audit', 3, 2, 8, 'urgent', 'approved', 100, '2025-09-15', '2025-10-15'),
('Sales Team Expansion', 'Hire and onboard new sales team members', 2, 1, 6, 'high', 'in_progress', 55, '2025-10-01', '2025-12-01'),
('Office Renovation', 'Plan and execute office renovation project', 5, 4, 9, 'medium', 'pending', 15, '2025-11-10', '2026-01-15');

-- Insert Sample Reports
INSERT INTO reports (title, description, report_type, created_by, department_id, status, start_date, end_date, data) VALUES
('October Sales Report', 'Monthly sales performance and analysis', 'monthly', 2, 1, 'approved', '2025-10-01', '2025-10-31', '{"total_sales": 125000, "target": 100000, "growth": 25}'::jsonb),
('Q3 IT Infrastructure Report', 'Quarterly IT infrastructure assessment', 'quarterly', 3, 2, 'approved', '2025-07-01', '2025-09-30', '{"uptime": 99.9, "incidents": 3, "resolved": 3}'::jsonb),
('September Marketing Report', 'Monthly marketing campaign performance', 'monthly', 4, 3, 'submitted', '2025-09-01', '2025-09-30', '{"reach": 50000, "engagement": 12.5, "conversions": 320}'::jsonb),
('Q3 Financial Report', 'Quarterly financial performance summary', 'quarterly', 5, 4, 'approved', '2025-07-01', '2025-09-30', '{"revenue": 450000, "expenses": 320000, "profit": 130000}'::jsonb),
('October Operations Report', 'Monthly operations efficiency report', 'monthly', 9, 5, 'draft', '2025-10-01', '2025-10-31', '{"efficiency": 88, "delays": 2, "on_time": 95}'::jsonb),
('Annual Sales Review 2024', 'Comprehensive annual sales review', 'annual', 2, 1, 'approved', '2024-01-01', '2024-12-31', '{"annual_sales": 1250000, "growth": 18, "new_clients": 45}'::jsonb);

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check tables created
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public';
    
    RAISE NOTICE '✅ Created % tables', table_count;
END $$;

-- Check data inserted
DO $$
DECLARE
    role_count INTEGER;
    dept_count INTEGER;
    user_count INTEGER;
    worksheet_count INTEGER;
    report_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO role_count FROM roles;
    SELECT COUNT(*) INTO dept_count FROM departments;
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO worksheet_count FROM worksheets;
    SELECT COUNT(*) INTO report_count FROM reports;
    
    RAISE NOTICE '✅ Inserted % roles', role_count;
    RAISE NOTICE '✅ Inserted % departments', dept_count;
    RAISE NOTICE '✅ Inserted % users', user_count;
    RAISE NOTICE '✅ Inserted % worksheets', worksheet_count;
    RAISE NOTICE '✅ Inserted % reports', report_count;
    
    RAISE NOTICE '';
    RAISE NOTICE '🎉 DATABASE SETUP COMPLETE!';
    RAISE NOTICE '';
    RAISE NOTICE '🔐 Test Credentials:';
    RAISE NOTICE '   Username: admin | Password: password123';
    RAISE NOTICE '   Username: sales.manager | Password: password123';
    RAISE NOTICE '   Username: it.manager | Password: password123';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Next: Start your backend server and login!';
END $$;
