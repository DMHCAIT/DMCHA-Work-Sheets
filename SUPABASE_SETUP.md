# SUPABASE SETUP GUIDE FOR DMHCA WORKSHEETS PORTAL

## ✅ COMPLETED STEPS

1. **Backend Configuration (.env)**
   - ✅ SUPABASE_URL configured
   - ✅ SUPABASE_ANON_KEY configured
   - ✅ SUPABASE_SERVICE_ROLE_KEY configured
   - ✅ JWT_SECRET configured
   - ✅ Database connection parameters set

2. **Supabase Client**
   - ✅ @supabase/supabase-js installed
   - ✅ Supabase client configured in `src/config/supabase.js`
   - ✅ Connection test successful

## 🔧 REQUIRED STEPS (Execute in Supabase Dashboard)

### Step 1: Access Supabase SQL Editor
Go to: https://supabase.com/dashboard/project/hnymialotvmtzyeignex/sql

### Step 2: Run Schema SQL
1. Click "New Query"
2. Copy entire contents of: `backend/database/schema.sql`
3. Paste into SQL editor
4. Click "Run" or press Ctrl+Enter
5. Wait for completion (creates 9 tables)

### Step 3: Run Seed SQL
1. Click "New Query" again
2. Copy entire contents of: `backend/database/seed.sql`
3. Paste into SQL editor
4. Click "Run" or press Ctrl+Enter
5. Wait for completion (adds sample data)

### Step 4: Verify Tables
Run this query to verify:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see these 9 tables:
- departments
- reports
- report_attachments
- roles
- users
- worksheets
- worksheet_assignments
- worksheet_attachments
- audit_logs (optional)

### Step 5: Verify Users
Run this query:
```sql
SELECT id, username, email, first_name, last_name 
FROM users 
LIMIT 5;
```

You should see users including:
- admin
- sales.manager
- it.manager
- john.sales
- etc.

## 🔐 TEST CREDENTIALS

After setup, use these credentials to login:

**Admin User:**
- Username: `admin`
- Password: `password123`

**Sales Manager:**
- Username: `sales.manager`
- Password: `password123`

**IT Manager:**
- Username: `it.manager`
- Password: `password123`

## 🚀 RESTART BACKEND

After completing database setup:

```powershell
cd "D:\Users\Admin\Desktop\DMHCA Work Sheets\backend"
npm start
```

## 🌐 ACCESS APPLICATION

1. **Backend API:** http://localhost:5000
2. **Frontend App:** http://localhost:3000
3. **Login Page:** http://localhost:3000/login

## 📊 DATABASE STRUCTURE

```
roles (5 roles)
  ├── Admin
  ├── Sales Manager
  ├── IT Manager
  ├── Marketing Manager
  └── Staff

departments (5 departments)
  ├── Sales
  ├── IT
  ├── Marketing
  ├── Administration
  └── Operations

users (13 users)
  └── Various users across departments

worksheets (sample data)
  └── Linked to users and departments

reports (sample data)
  └── Monthly and quarterly reports
```

## 🔍 TROUBLESHOOTING

### If tables already exist:
Drop all tables first in SQL editor:
```sql
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS report_attachments CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS worksheet_assignments CASCADE;
DROP TABLE IF EXISTS worksheet_attachments CASCADE;
DROP TABLE IF EXISTS worksheets CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
```

Then run schema.sql and seed.sql again.

### If connection fails:
1. Verify .env file has correct credentials
2. Check Supabase project is active
3. Ensure service role key is correct
4. Test connection: `node test-connection.js`

### If login fails with 500 error:
- Database tables are missing → Run schema.sql
- No users in database → Run seed.sql
- Wrong credentials → Use admin/password123

## ✅ VERIFICATION CHECKLIST

- [ ] Ran schema.sql in Supabase SQL Editor
- [ ] Ran seed.sql in Supabase SQL Editor
- [ ] Verified 9 tables exist
- [ ] Verified users table has data (13 users)
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] Can login with admin/password123
- [ ] Dashboard loads with real data

## 📝 FILES LOCATION

- Schema: `D:\Users\Admin\Desktop\DMHCA Work Sheets\backend\database\schema.sql`
- Seed: `D:\Users\Admin\Desktop\DMHCA Work Sheets\backend\database\seed.sql`
- Config: `D:\Users\Admin\Desktop\DMHCA Work Sheets\backend\.env`

## 🎯 NEXT STEPS AFTER SETUP

Once database is set up and you can login:
1. ✅ Dashboard is already connected (no mock data)
2. Connect Worksheets page to API
3. Connect Reports page to API
4. Connect Users page to API

---

**Current Status:** Supabase connection configured ✅
**Action Required:** Execute SQL files in Supabase Dashboard
**Estimated Time:** 5 minutes
