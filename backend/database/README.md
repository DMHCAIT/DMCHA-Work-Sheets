# Database Setup Guide

## Quick Start

### 1. Create Database

```powershell
# Open PostgreSQL shell
psql -U postgres

# Create database
CREATE DATABASE dmhca_worksheets;

# Exit
\q
```

### 2. Run Schema

```powershell
psql -U postgres -d dmhca_worksheets -f database/schema.sql
```

### 3. Run Seed Data

```powershell
psql -U postgres -d dmhca_worksheets -f database/seed.sql
```

## Demo User Credentials

All users have the password: `password123`

| Role | Email | Department | Access Level |
|------|-------|------------|--------------|
| **Super Admin** | admin@dmhca.com | - | Full system access |
| **Dept Manager** | sales.manager@dmhca.com | Sales | Department data access |
| **Dept Manager** | it.manager@dmhca.com | IT | Department data access |
| **Dept Manager** | marketing.manager@dmhca.com | Marketing | Department data access |
| **Dept Manager** | admin.manager@dmhca.com | Administration | Department data access |
| **Employee** | john.sales@dmhca.com | Sales | Own data only |
| **Employee** | jane.dev@dmhca.com | IT | Own data only |
| **Employee** | amy.marketing@dmhca.com | Marketing | Own data only |
| **Auditor** | auditor@dmhca.com | - | Read-only access |

## Role Hierarchy

```
Super Admin (Admin)
├── Full access to all departments
├── Can create/edit/delete all users
├── Can approve all worksheets and reports
└── Can view audit logs

Department Manager
├── Access to own department data only
├── Can approve department worksheets/reports
├── Can view department employees
└── Cannot delete data

Employee
├── Access to own data only
├── Can create worksheets and reports
├── Can view assigned worksheets
└── Cannot approve or delete

Auditor
├── Read-only access to all data
├── Can view audit logs
└── Cannot create, edit, or delete
```

## Database Schema Overview

### Core Tables

1. **roles** - User role definitions with permissions
2. **departments** - Department information
3. **users** - User accounts with authentication
4. **worksheets** - Work assignments and tracking
5. **reports** - Work reports (daily, weekly, monthly, etc.)
6. **worksheet_attachments** - File attachments for worksheets
7. **report_attachments** - File attachments for reports
8. **worksheet_assignments** - Multiple assignees per worksheet
9. **audit_logs** - System audit trail

### Sample Data Included

- ✅ 5 Roles (Admin, Dept Manager, Employee, Team Lead, Auditor)
- ✅ 4 Departments (Sales, IT, Marketing, Administration)
- ✅ 13 Users across all departments
- ✅ 11 Sample Worksheets with various statuses
- ✅ 8 Sample Reports (daily, weekly, monthly, quarterly, custom)
- ✅ Sample audit log entries

## Verify Installation

```powershell
# Connect to database
psql -U postgres -d dmhca_worksheets

# Check tables
\dt

# Check users
SELECT id, email, role_id, department_id, status FROM users;

# Check departments
SELECT id, department_name, manager_id FROM departments;

# Check worksheets
SELECT id, title, status, priority FROM worksheets;

# Check reports
SELECT id, title, report_type, status FROM reports;

# Exit
\q
```

## Reset Database

If you need to start fresh:

```powershell
# Drop and recreate
psql -U postgres

DROP DATABASE IF EXISTS dmhca_worksheets;
CREATE DATABASE dmhca_worksheets;
\q

# Run schema and seed again
psql -U postgres -d dmhca_worksheets -f database/schema.sql
psql -U postgres -d dmhca_worksheets -f database/seed.sql
```

## Environment Configuration

Update your `.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dmhca_worksheets
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_SSL=false
```

## Security Notes

⚠️ **IMPORTANT:**
- Change all default passwords immediately after first login
- Use strong passwords in production
- Never commit `.env` files to version control
- Rotate JWT secrets regularly
- Enable SSL for production databases

## Troubleshooting

### Connection Failed
```powershell
# Check if PostgreSQL is running
Get-Service postgresql*

# Restart if needed
Restart-Service postgresql-x64-15
```

### Permission Denied
```powershell
# Grant permissions
psql -U postgres -d dmhca_worksheets

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
```

### Schema Already Exists
The schema file includes `DROP TABLE IF EXISTS` commands, so it's safe to run multiple times.

## Next Steps

1. ✅ Database created and seeded
2. ➡️ Configure backend `.env` file
3. ➡️ Start backend server: `npm run dev`
4. ➡️ Start frontend server: `cd frontend && npm run dev`
5. ➡️ Login at http://localhost:3000/login
6. ➡️ Test with different user roles
7. ➡️ Change all default passwords

## Support

For issues:
1. Check PostgreSQL logs
2. Verify connection settings in `.env`
3. Ensure all tables were created: `\dt` in psql
4. Check user count: `SELECT COUNT(*) FROM users;`
