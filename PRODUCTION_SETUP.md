# 🚀 Production Setup Guide - DMHCA Worksheets Portal

## Overview

This guide will help you set up the DMHCA Worksheets Portal for production use with full backend integration, role-based access control, and data isolation.

## 📋 What's New in Production Mode

✅ **Real Authentication** - No more demo mode, proper JWT-based auth  
✅ **Role Hierarchy** - Super Admin → Department Manager → Employee  
✅ **Data Isolation** - Employees see only their own data  
✅ **Department Filtering** - Managers see only department data  
✅ **Protected Routes** - Role-based page access  
✅ **API Integration** - All pages connected to backend  
✅ **Audit Trail** - Complete activity logging  

## 🛠️ Prerequisites

Before starting, ensure you have:

- ✅ Node.js v18 or higher
- ✅ PostgreSQL v15 or higher
- ✅ Git (optional)
- ✅ Windows PowerShell or Command Prompt

## 📦 Step 1: Database Setup

### 1.1 Install PostgreSQL

If not already installed:
1. Download from https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember your postgres password!

### 1.2 Create Database

```powershell
# Open PowerShell as Administrator
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE dmhca_worksheets;

# Verify
\l

# Exit
\q
```

### 1.3 Run Schema and Seed Data

```powershell
# Navigate to project root
cd "d:\Users\Admin\Desktop\DMHCA Work Sheets"

# Run schema (creates all tables)
psql -U postgres -d dmhca_worksheets -f backend/database/schema.sql

# Run seed data (creates demo users and sample data)
psql -U postgres -d dmhca_worksheets -f backend/database/seed.sql
```

**✅ Expected Output:**
```
Database schema created successfully!
Seed data inserted successfully!
[Demo credentials displayed]
```

### 1.4 Verify Database

```powershell
psql -U postgres -d dmhca_worksheets

# Check tables
\dt

# Expected: 9 tables (roles, departments, users, worksheets, reports, etc.)

# Check users
SELECT email, role_id, department_id FROM users;

# Expected: 13 users across different roles and departments

\q
```

## ⚙️ Step 2: Backend Configuration

### 2.1 Create .env File

```powershell
cd backend

# Copy example env
copy .env.example .env

# Edit .env file
notepad .env
```

### 2.2 Update .env with Your Settings

```env
# Server Configuration
NODE_ENV=production
PORT=5000
API_BASE_URL=http://localhost:5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dmhca_worksheets
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE
DB_SSL=false

# JWT Authentication (CHANGE THESE!)
JWT_SECRET=your-super-secret-random-string-min-32-chars-here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Password Security
BCRYPT_ROUNDS=12

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**🔐 Security Tips:**
- Generate strong JWT_SECRET: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Never commit `.env` to version control
- Use different secrets for production

### 2.3 Install Backend Dependencies

```powershell
# Still in backend directory
npm install
```

### 2.4 Start Backend Server

```powershell
npm run dev
```

**✅ Expected Output:**
```
Server running on port 5000
Database connected successfully
```

**Test Backend:**
- Health check: http://localhost:5000/health
- Should return: `{"status":"ok","timestamp":"..."}`

## 🎨 Step 3: Frontend Configuration

### 3.1 Create Frontend .env

```powershell
# Open NEW PowerShell window
cd "d:\Users\Admin\Desktop\DMHCA Work Sheets\frontend"

# Copy example env
copy .env.example .env

# Edit .env file
notepad .env
```

### 3.2 Update Frontend .env

```env
VITE_API_URL=http://localhost:5000/api
```

### 3.3 Install Frontend Dependencies

```powershell
npm install
```

### 3.4 Start Frontend Server

```powershell
npm run dev
```

**✅ Expected Output:**
```
VITE ready in XXX ms
Local: http://localhost:3000/
```

## 🔐 Step 4: Test Authentication & Roles

### 4.1 Login as Super Admin

1. Open browser: http://localhost:3000/login
2. Login with:
   - Email: `admin@dmhca.com`
   - Password: `password123`

**✅ Expected Behavior:**
- Redirected to dashboard
- See "Production Mode" badge in sidebar
- Can see "Users" menu item
- Can access all pages
- See all departments' data

### 4.2 Test Department Manager

1. Logout (click Logout button in sidebar)
2. Login with:
   - Email: `sales.manager@dmhca.com`
   - Password: `password123`

**✅ Expected Behavior:**
- Can see "Users" menu item
- Can see department employees only
- Can see department worksheets/reports
- Can approve department work
- Cannot see other departments' data

### 4.3 Test Employee

1. Logout
2. Login with:
   - Email: `john.sales@dmhca.com`
   - Password: `password123`

**✅ Expected Behavior:**
- **CANNOT** see "Users" menu item
- Can only see own worksheets
- Can only see own reports
- Can create new work
- Cannot approve work
- Cannot see other employees' data

### 4.4 Test Data Isolation

**As Employee (john.sales@dmhca.com):**
- Go to Worksheets page
- Should see only worksheets:
  - Created by you
  - Assigned to you
- Should NOT see other employees' worksheets

**As Department Manager (sales.manager@dmhca.com):**
- Go to Worksheets page
- Should see all Sales department worksheets
- Should NOT see IT or Marketing worksheets

**As Super Admin (admin@dmhca.com):**
- Go to Worksheets page
- Should see ALL worksheets from ALL departments

## 📊 Step 5: Verify Features

### 5.1 Test Worksheets Page

**Create Worksheet:**
1. Login as employee
2. Go to Worksheets
3. Click "+ New Worksheet"
4. Fill form and submit
5. Verify it appears in list

**Assign Worksheet:**
1. Login as manager
2. Go to Worksheets
3. Open a worksheet
4. Assign to employee
5. Verify employee can see it

### 5.2 Test Reports Page

**Submit Report:**
1. Login as employee
2. Go to Reports
3. Click "Submit Report"
4. Fill form with:
   - Title
   - Description
   - Report Type (daily, weekly, monthly, etc.)
   - Date range
5. Submit
6. Verify it appears in list

**Approve Report:**
1. Login as manager
2. Go to Reports
3. Find submitted report
4. Click "Approve"
5. Verify status changes

### 5.3 Test Users Page (Admin/Manager Only)

**View Users:**
1. Login as admin or manager
2. Go to Users page
3. Verify you can see users

**As Employee:**
1. Login as employee
2. Try to access /users
3. Should see "Access Denied" message

## 🔍 Step 6: Troubleshooting

### Backend Won't Start

**Error: "Database connection failed"**
```powershell
# Check PostgreSQL service
Get-Service postgresql*

# If not running
Start-Service postgresql-x64-15

# Test connection
psql -U postgres -d dmhca_worksheets -c "SELECT 1;"
```

**Error: "Port 5000 in use"**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (use PID from above)
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=5001
```

### Frontend Won't Connect

**Error: "Network Error" or "Cannot connect to API"**
1. Verify backend is running: http://localhost:5000/health
2. Check `frontend/.env` has correct API_URL
3. Check CORS settings in `backend/.env`
4. Clear browser cache and hard reload (Ctrl+Shift+R)

### Login Fails

**Error: "Invalid credentials"**
- Verify you're using correct email (not username)
- Password is: `password123` (case-sensitive)
- Check backend logs for errors

**Backend returns 500 error:**
```powershell
# Check if seed data was loaded
psql -U postgres -d dmhca_worksheets -c "SELECT COUNT(*) FROM users;"

# Should return: 13

# If 0, run seed again
psql -U postgres -d dmhca_worksheets -f backend/database/seed.sql
```

### Data Not Showing

**Empty worksheets/reports:**
- Verify seed data was loaded
- Check browser console for API errors
- Verify you're logged in as correct user
- Check backend terminal for error messages

### Role Access Issues

**Employee can see Users page:**
- Hard reload frontend (Ctrl+Shift+R)
- Check user role in database:
  ```sql
  SELECT u.email, r.role_name 
  FROM users u 
  JOIN roles r ON u.role_id = r.id 
  WHERE u.email = 'john.sales@dmhca.com';
  ```

## 📈 Step 7: Production Checklist

Before deploying to production:

### Security
- [ ] Change all default passwords
- [ ] Generate strong JWT_SECRET
- [ ] Enable SSL/HTTPS
- [ ] Configure firewall rules
- [ ] Set up SSL for database connection
- [ ] Review and update CORS settings
- [ ] Enable rate limiting
- [ ] Set up proper backup schedule

### Configuration
- [ ] Update NODE_ENV=production
- [ ] Configure production database
- [ ] Set up email notifications
- [ ] Configure file upload limits
- [ ] Set up logging to files
- [ ] Configure data retention policies

### Testing
- [ ] Test all user roles
- [ ] Verify data isolation
- [ ] Test worksheet lifecycle
- [ ] Test report submission/approval
- [ ] Test file uploads
- [ ] Load testing with multiple users
- [ ] Cross-browser testing

### Monitoring
- [ ] Set up error logging
- [ ] Configure audit log retention
- [ ] Set up database backups
- [ ] Configure alerting for errors
- [ ] Monitor API response times
- [ ] Track user activity

## 🎯 Quick Reference

### Demo Accounts

| Role | Email | Password | Can Access |
|------|-------|----------|------------|
| **Super Admin** | admin@dmhca.com | password123 | Everything |
| **Sales Manager** | sales.manager@dmhca.com | password123 | Sales dept only |
| **IT Manager** | it.manager@dmhca.com | password123 | IT dept only |
| **Sales Employee** | john.sales@dmhca.com | password123 | Own data only |
| **IT Employee** | jane.dev@dmhca.com | password123 | Own data only |

### Port Reference

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432

### Key Files

- Backend config: `backend/.env`
- Frontend config: `frontend/.env`
- Database schema: `backend/database/schema.sql`
- Seed data: `backend/database/seed.sql`

### Useful Commands

```powershell
# Backend
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server

# Frontend
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Database
psql -U postgres -d dmhca_worksheets    # Connect to DB
\dt                                      # List tables
\d users                                 # Describe users table
SELECT * FROM users;                     # View all users
\q                                       # Quit
```

## ✅ Success Criteria

Your setup is successful if:

1. ✅ Backend starts without errors on port 5000
2. ✅ Frontend starts without errors on port 3000
3. ✅ Can login with demo credentials
4. ✅ Super Admin sees all data
5. ✅ Department Manager sees only department data
6. ✅ Employee sees only own data
7. ✅ Employee cannot access Users page
8. ✅ Can create worksheets and reports
9. ✅ Can approve work as manager
10. ✅ "Production Mode" shows in sidebar

## 🆘 Getting Help

If you're stuck:

1. Check this guide's Troubleshooting section
2. Review backend terminal for errors
3. Check browser console for errors
4. Verify database connection and data
5. Ensure all environment variables are set
6. Try resetting database (see Database Setup → Reset Database)

## 🎉 Next Steps

After successful setup:

1. **Change all passwords** - Use Settings page
2. **Create real users** - Replace demo accounts
3. **Configure departments** - Match your org structure
4. **Set up email** - Enable notifications
5. **Train users** - Show them the system
6. **Monitor usage** - Check audit logs
7. **Plan backups** - Protect your data

---

**🎊 Congratulations!** You now have a fully functional, production-ready DMHCA Worksheets Portal with:
- Real authentication (no demo mode)
- Role-based access control
- Data isolation by role and department
- Complete audit trail
- API-driven architecture

**Happy worksheeting! 📝**
