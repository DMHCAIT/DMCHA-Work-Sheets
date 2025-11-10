const bcrypt = require('bcrypt');
const { query } = require('../config/database');
const logger = require('../utils/logger');
const { pool } = require('../config/database');

const seed = async () => {
  try {
    logger.info('🌱 Starting database seeding...');

    // 1. Seed Departments
    logger.info('Seeding departments...');
    const departments = [
      { name: 'Sales', description: 'Sales and business development team' },
      { name: 'IT', description: 'Information technology and development' },
      { name: 'Digital Marketing', description: 'Digital marketing and online campaigns' },
      { name: 'Administration', description: 'Administrative and support services' }
    ];

    const departmentIds = {};
    for (const dept of departments) {
      const result = await query(
        `INSERT INTO departments (name, description) 
         VALUES ($1, $2) 
         ON CONFLICT (name) DO UPDATE SET description = $2 
         RETURNING id`,
        [dept.name, dept.description]
      );
      departmentIds[dept.name] = result.rows[0].id;
    }

    // 2. Seed Roles with permissions
    logger.info('Seeding roles...');
    const roles = [
      {
        name: 'Admin',
        description: 'Full system access',
        permissions: {
          users: ['create', 'read', 'update', 'delete'],
          departments: ['create', 'read', 'update', 'delete'],
          roles: ['create', 'read', 'update', 'delete'],
          worksheets: ['create', 'read', 'update', 'delete', 'approve'],
          reports: ['create', 'read', 'update', 'delete', 'approve', 'export'],
          dashboards: ['read', 'export'],
          audit: ['read', 'export'],
          settings: ['read', 'update']
        }
      },
      {
        name: 'Department Manager',
        description: 'Manage department operations',
        permissions: {
          users: ['read'],
          worksheets: ['read', 'approve'],
          reports: ['read', 'approve', 'export'],
          dashboards: ['read', 'export'],
          audit: ['read']
        }
      },
      {
        name: 'Team Lead',
        description: 'Lead and review team work',
        permissions: {
          users: ['read'],
          worksheets: ['create', 'read', 'update', 'review'],
          reports: ['read', 'export'],
          dashboards: ['read']
        }
      },
      {
        name: 'Employee',
        description: 'Standard employee access',
        permissions: {
          worksheets: ['create', 'read', 'update'],
          reports: ['read'],
          dashboards: ['read']
        }
      },
      {
        name: 'Auditor',
        description: 'Read-only audit access',
        permissions: {
          worksheets: ['read'],
          reports: ['read', 'export'],
          dashboards: ['read'],
          audit: ['read', 'export']
        }
      }
    ];

    const roleIds = {};
    for (const role of roles) {
      const result = await query(
        `INSERT INTO roles (name, description, permissions) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (name) DO UPDATE SET description = $2, permissions = $3 
         RETURNING id`,
        [role.name, role.description, JSON.stringify(role.permissions)]
      );
      roleIds[role.name] = result.rows[0].id;
    }

    // 3. Seed Users
    logger.info('Seeding users...');
    const adminPassword = await bcrypt.hash('Admin@123', 12);
    const defaultPassword = await bcrypt.hash('Password@123', 12);

    const users = [
      {
        username: 'admin',
        password_hash: adminPassword,
        email: 'admin@dmhca.com',
        first_name: 'System',
        last_name: 'Administrator',
        role: 'Admin',
        department: null
      },
      {
        username: 'sales.manager',
        password_hash: defaultPassword,
        email: 'sales.manager@dmhca.com',
        first_name: 'Sarah',
        last_name: 'Johnson',
        role: 'Department Manager',
        department: 'Sales'
      },
      {
        username: 'it.manager',
        password_hash: defaultPassword,
        email: 'it.manager@dmhca.com',
        first_name: 'Michael',
        last_name: 'Chen',
        role: 'Department Manager',
        department: 'IT'
      },
      {
        username: 'marketing.manager',
        password_hash: defaultPassword,
        email: 'marketing.manager@dmhca.com',
        first_name: 'Emily',
        last_name: 'Rodriguez',
        role: 'Department Manager',
        department: 'Digital Marketing'
      },
      {
        username: 'admin.manager',
        password_hash: defaultPassword,
        email: 'admin.manager@dmhca.com',
        first_name: 'David',
        last_name: 'Williams',
        role: 'Department Manager',
        department: 'Administration'
      },
      {
        username: 'john.sales',
        password_hash: defaultPassword,
        email: 'john.sales@dmhca.com',
        first_name: 'John',
        last_name: 'Smith',
        role: 'Employee',
        department: 'Sales'
      },
      {
        username: 'jane.dev',
        password_hash: defaultPassword,
        email: 'jane.dev@dmhca.com',
        first_name: 'Jane',
        last_name: 'Developer',
        role: 'Employee',
        department: 'IT'
      },
      {
        username: 'auditor',
        password_hash: defaultPassword,
        email: 'auditor@dmhca.com',
        first_name: 'Audit',
        last_name: 'User',
        role: 'Auditor',
        department: null
      }
    ];

    for (const user of users) {
      await query(
        `INSERT INTO users (username, password_hash, email, first_name, last_name, role_id, department_id, force_password_change) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (username) DO NOTHING`,
        [
          user.username,
          user.password_hash,
          user.email,
          user.first_name,
          user.last_name,
          roleIds[user.role],
          user.department ? departmentIds[user.department] : null,
          user.username !== 'admin' // Force password change for all except admin
        ]
      );
    }

    // 4. Seed Worksheet Templates
    logger.info('Seeding worksheet templates...');
    const templates = [
      {
        name: 'Daily Sales Activity',
        department: 'Sales',
        frequency: 'daily',
        fields: [
          { name: 'leads_contacted', label: 'Leads Contacted', type: 'number', required: true },
          { name: 'demos_scheduled', label: 'Demos Scheduled', type: 'number', required: true },
          { name: 'proposals_sent', label: 'Proposals Sent', type: 'number', required: true },
          { name: 'deals_closed', label: 'Deals Closed', type: 'number', required: true },
          { name: 'revenue', label: 'Revenue Generated', type: 'number', required: false },
          { name: 'notes', label: 'Notes', type: 'textarea', required: false }
        ]
      },
      {
        name: 'IT Sprint Task',
        department: 'IT',
        frequency: 'daily',
        fields: [
          { name: 'story_points', label: 'Story Points Completed', type: 'number', required: true },
          { name: 'tickets_resolved', label: 'Tickets Resolved', type: 'number', required: true },
          { name: 'bugs_fixed', label: 'Bugs Fixed', type: 'number', required: true },
          { name: 'code_reviews', label: 'Code Reviews Done', type: 'number', required: true },
          { name: 'deployments', label: 'Deployments', type: 'number', required: false },
          { name: 'technical_notes', label: 'Technical Notes', type: 'textarea', required: false }
        ]
      },
      {
        name: 'Marketing Campaign Report',
        department: 'Digital Marketing',
        frequency: 'daily',
        fields: [
          { name: 'campaigns_launched', label: 'Campaigns Launched', type: 'number', required: true },
          { name: 'ad_spend', label: 'Ad Spend', type: 'number', required: true },
          { name: 'impressions', label: 'Impressions', type: 'number', required: true },
          { name: 'clicks', label: 'Clicks', type: 'number', required: true },
          { name: 'conversions', label: 'Conversions', type: 'number', required: true },
          { name: 'campaign_notes', label: 'Campaign Notes', type: 'textarea', required: false }
        ]
      },
      {
        name: 'Admin Daily Tasks',
        department: 'Administration',
        frequency: 'daily',
        fields: [
          { name: 'tickets_processed', label: 'Tickets Processed', type: 'number', required: true },
          { name: 'procurement_orders', label: 'Procurement Orders', type: 'number', required: false },
          { name: 'invoices_processed', label: 'Invoices Processed', type: 'number', required: false },
          { name: 'meetings_scheduled', label: 'Meetings Scheduled', type: 'number', required: false },
          { name: 'admin_notes', label: 'Notes', type: 'textarea', required: false }
        ]
      }
    ];

    for (const template of templates) {
      await query(
        `INSERT INTO worksheet_templates (name, department_id, frequency, fields) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
        [
          template.name,
          departmentIds[template.department],
          template.frequency,
          JSON.stringify(template.fields)
        ]
      );
    }

    logger.info('✅ Database seeding completed successfully');
    logger.info('📝 Default credentials:');
    logger.info('   Admin: username=admin, password=Admin@123');
    logger.info('   Others: username=<username>, password=Password@123');
    logger.info('⚠️  Please change these passwords in production!');
    
    process.exit(0);
  } catch (error) {
    logger.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seed();
}

module.exports = { seed };
