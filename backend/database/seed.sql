-- DMHCA Worksheets Portal - Seed Data
-- Initial data for development and testing
-- Note: All passwords are hashed using bcrypt with 12 rounds
-- Default password for all users: "password123"
-- Bcrypt hash: $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyJ3TnMCcF8e

-- Insert Roles
INSERT INTO roles (role_name, description, permissions) VALUES
('Admin', 'System Administrator with full access', 
    '{"worksheets": {"create": true, "read": true, "update": true, "delete": true, "approve": true}, 
      "reports": {"create": true, "read": true, "update": true, "delete": true, "approve": true}, 
      "users": {"create": true, "read": true, "update": true, "delete": true}, 
      "departments": {"create": true, "read": true, "update": true, "delete": true}, 
      "audit": {"read": true}}'::jsonb),
      
('Department Manager', 'Manages department and employees', 
    '{"worksheets": {"create": true, "read": true, "update": true, "delete": false, "approve": true}, 
      "reports": {"create": true, "read": true, "update": true, "delete": false, "approve": true}, 
      "users": {"create": false, "read": true, "update": true, "delete": false}, 
      "departments": {"create": false, "read": true, "update": false, "delete": false}}'::jsonb),
      
('Employee', 'Regular employee - creates and submits work', 
    '{"worksheets": {"create": true, "read": true, "update": true, "delete": false, "approve": false}, 
      "reports": {"create": true, "read": true, "update": true, "delete": false, "approve": false}, 
      "users": {"create": false, "read": false, "update": false, "delete": false}}'::jsonb),
      
('Team Lead', 'Team leader with limited approval rights', 
    '{"worksheets": {"create": true, "read": true, "update": true, "delete": false, "approve": true}, 
      "reports": {"create": true, "read": true, "update": true, "delete": false, "approve": false}, 
      "users": {"create": false, "read": true, "update": false, "delete": false}}'::jsonb),
      
('Auditor', 'View-only access for auditing', 
    '{"worksheets": {"create": false, "read": true, "update": false, "delete": false, "approve": false}, 
      "reports": {"create": false, "read": true, "update": false, "delete": false, "approve": false}, 
      "users": {"create": false, "read": true, "update": false, "delete": false}, 
      "audit": {"read": true}}'::jsonb);

-- Insert Departments
INSERT INTO departments (department_name, description) VALUES
('Sales', 'Sales and Business Development'),
('IT', 'Information Technology Department'),
('Digital Marketing', 'Digital Marketing and Social Media'),
('Administration', 'Administration and Operations');

-- Insert Users (password: password123 for all)
-- Admin User
INSERT INTO users (username, email, password_hash, first_name, last_name, phone, role_id, department_id, status) 
VALUES 
('admin', 'admin@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyJ3TnMCcF8e', 
    'Super', 'Admin', '+1-555-0001', 1, NULL, 'active');

-- Department Managers
INSERT INTO users (username, email, password_hash, first_name, last_name, phone, role_id, department_id, status) 
VALUES 
('sales.manager', 'sales.manager@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyJ3TnMCcF8e', 
    'Sarah', 'Johnson', '+1-555-0101', 2, 1, 'active'),
    
('it.manager', 'it.manager@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyJ3TnMCcF8e', 
    'Michael', 'Chen', '+1-555-0201', 2, 2, 'active'),
    
('marketing.manager', 'marketing.manager@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyJ3TnMCcF8e', 
    'Emily', 'Rodriguez', '+1-555-0301', 2, 3, 'active'),
    
('admin.manager', 'admin.manager@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyJ3TnMCcF8e', 
    'David', 'Williams', '+1-555-0401', 2, 4, 'active');

-- Employees
INSERT INTO users (username, email, password_hash, first_name, last_name, phone, role_id, department_id, status) 
VALUES 
-- Sales Employees
('john.sales', 'john.sales@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyJ3TnMCcF8e', 
    'John', 'Smith', '+1-555-1001', 3, 1, 'active'),
    
('lisa.sales', 'lisa.sales@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyJ3TnMCcF8e', 
    'Lisa', 'Anderson', '+1-555-1002', 3, 1, 'active'),

-- IT Employees
('jane.dev', 'jane.dev@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyJ3TnMCcF8e', 
    'Jane', 'Wilson', '+1-555-2001', 3, 2, 'active'),
    
('bob.dev', 'bob.dev@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyJ3TnMCcF8e', 
    'Bob', 'Martinez', '+1-555-2002', 3, 2, 'active'),

-- Marketing Employees
('amy.marketing', 'amy.marketing@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyJ3TnMCcF8e', 
    'Amy', 'Taylor', '+1-555-3001', 3, 3, 'active'),
    
('tom.marketing', 'tom.marketing@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyJ3TnMCcF8e', 
    'Tom', 'Garcia', '+1-555-3002', 3, 3, 'active'),

-- Admin Employees
('mary.admin', 'mary.admin@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyJ3TnMCcF8e', 
    'Mary', 'Brown', '+1-555-4001', 3, 4, 'active'),

-- Auditor
('auditor', 'auditor@dmhca.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyJ3TnMCcF8e', 
    'Alex', 'Davis', '+1-555-5001', 5, NULL, 'active');

-- Update department managers
UPDATE departments SET manager_id = 2 WHERE department_name = 'Sales';
UPDATE departments SET manager_id = 3 WHERE department_name = 'IT';
UPDATE departments SET manager_id = 4 WHERE department_name = 'Digital Marketing';
UPDATE departments SET manager_id = 5 WHERE department_name = 'Administration';

-- Insert Sample Worksheets
INSERT INTO worksheets (title, description, created_by, department_id, assigned_to, priority, status, progress, start_date, due_date)
VALUES 
-- Sales Worksheets
('Q1 Sales Report Preparation', 'Compile sales data and prepare Q1 report', 6, 1, 6, 'high', 'in_progress', 60, '2024-01-15', '2024-01-31'),
('Client Database Update', 'Update and verify all client contact information', 2, 1, 7, 'medium', 'in_progress', 40, '2024-01-10', '2024-01-25'),
('New Product Launch Planning', 'Plan marketing strategy for new product line', 2, 1, 6, 'urgent', 'pending', 0, '2024-01-20', '2024-02-15'),

-- IT Worksheets
('System Security Audit', 'Perform comprehensive security audit of all systems', 8, 2, 8, 'urgent', 'in_progress', 75, '2024-01-05', '2024-01-22'),
('Server Upgrade Project', 'Upgrade production servers to latest OS version', 3, 2, 9, 'high', 'in_progress', 50, '2024-01-12', '2024-02-01'),
('Employee Portal Enhancement', 'Add new features to employee self-service portal', 8, 2, 9, 'medium', 'draft', 10, '2024-01-18', '2024-02-10'),

-- Marketing Worksheets
('Social Media Campaign - January', 'Plan and execute January social media campaign', 10, 3, 10, 'high', 'in_progress', 65, '2024-01-01', '2024-01-31'),
('Website Content Refresh', 'Update website content and optimize SEO', 4, 3, 11, 'medium', 'in_progress', 45, '2024-01-08', '2024-01-30'),
('Email Marketing Automation', 'Set up automated email marketing workflows', 10, 3, 10, 'low', 'draft', 0, '2024-01-20', '2024-02-20'),

-- Administration Worksheets
('Q1 Budget Review', 'Review and approve Q1 budget allocations', 12, 4, 12, 'high', 'in_progress', 80, '2024-01-01', '2024-01-20'),
('Office Supplies Inventory', 'Conduct inventory check and place orders', 5, 4, 12, 'low', 'completed', 100, '2024-01-05', '2024-01-15');

-- Insert Sample Reports
INSERT INTO reports (title, description, report_type, created_by, department_id, status, start_date, end_date, submitted_at)
VALUES 
-- Daily Reports
('Daily Sales Update - Jan 15', 'Daily sales activities and results', 'daily', 6, 1, 'submitted', '2024-01-15', '2024-01-15', '2024-01-15 18:00:00'),
('Daily IT Operations - Jan 15', 'System status and incident reports', 'daily', 8, 2, 'submitted', '2024-01-15', '2024-01-15', '2024-01-15 17:30:00'),

-- Weekly Reports
('Weekly Marketing Activities', 'Week 3 marketing campaign results', 'weekly', 10, 3, 'approved', '2024-01-15', '2024-01-21', '2024-01-21 16:00:00'),
('Weekly Sales Performance', 'Week 3 sales metrics and pipeline', 'weekly', 2, 1, 'submitted', '2024-01-15', '2024-01-21', '2024-01-21 18:00:00'),

-- Monthly Reports
('December 2023 Sales Report', 'Complete sales report for December', 'monthly', 2, 1, 'approved', '2023-12-01', '2023-12-31', '2024-01-05 10:00:00'),
('December 2023 IT Report', 'IT operations and project status', 'monthly', 3, 2, 'approved', '2023-12-01', '2023-12-31', '2024-01-06 14:00:00'),

-- Quarterly Reports
('Q4 2023 Marketing Summary', 'Quarterly marketing performance review', 'quarterly', 4, 3, 'approved', '2023-10-01', '2023-12-31', '2024-01-10 11:00:00'),

-- Custom Range Reports
('Holiday Season Analysis', 'Sales and marketing analysis for holiday period', 'custom', 2, 1, 'draft', '2023-11-20', '2024-01-05', NULL);

-- Insert Audit Logs (Sample)
INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values, ip_address)
VALUES 
(1, 'user.login', 'user', 1, '{"status": "success"}'::jsonb, '192.168.1.100'),
(2, 'worksheet.create', 'worksheet', 2, '{"title": "Client Database Update"}'::jsonb, '192.168.1.101'),
(6, 'report.submit', 'report', 1, '{"status": "submitted"}'::jsonb, '192.168.1.102'),
(3, 'user.update', 'user', 8, '{"role_id": 3}'::jsonb, '192.168.1.100');

-- Success Message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Seed data inserted successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Demo Login Credentials:';
    RAISE NOTICE '------------------------';
    RAISE NOTICE 'Super Admin:';
    RAISE NOTICE '  Email: admin@dmhca.com';
    RAISE NOTICE '  Password: password123';
    RAISE NOTICE '';
    RAISE NOTICE 'Department Manager (Sales):';
    RAISE NOTICE '  Email: sales.manager@dmhca.com';
    RAISE NOTICE '  Password: password123';
    RAISE NOTICE '';
    RAISE NOTICE 'Employee (Sales):';
    RAISE NOTICE '  Email: john.sales@dmhca.com';
    RAISE NOTICE '  Password: password123';
    RAISE NOTICE '';
    RAISE NOTICE 'Employee (IT):';
    RAISE NOTICE '  Email: jane.dev@dmhca.com';
    RAISE NOTICE '  Password: password123';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT: Change all passwords after first login!';
    RAISE NOTICE '';
    RAISE NOTICE 'Database is now ready for use!';
    RAISE NOTICE '========================================';
END $$;
