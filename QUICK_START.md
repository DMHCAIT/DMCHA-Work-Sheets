# 🚀 QUICK START - Production Mode

## ⏱️ 5-Minute Setup

### 1. Database Setup (2 minutes)

```powershell
# Create database
psql -U postgres -c "CREATE DATABASE dmhca_worksheets;"

# Run schema and seed (creates 9 tables, 13 users, sample data)
cd "d:\Users\Admin\Desktop\DMHCA Work Sheets"
psql -U postgres -d dmhca_worksheets -f backend/database/schema.sql
psql -U postgres -d dmhca_worksheets -f backend/database/seed.sql
```

✅ **Expected:** "Seed data inserted successfully!" with login credentials

### 2. Backend Setup (1 minute)

```powershell
cd backend

# Create .env
copy .env.example .env

# Edit these two lines in .env:
# DB_PASSWORD=your_postgres_password
# JWT_SECRET=any-random-32-char-string-here-12345

# Install and start
npm install
npm run dev
```

✅ **Expected:** "Server running on port 5000" + "Database connected"

### 3. Frontend Setup (1 minute)

```powershell
# Open NEW terminal
cd frontend

# Create .env (default values are fine)
copy .env.example .env

# Install and start
npm install
npm run dev
```

✅ **Expected:** "Local: http://localhost:3000/"

### 4. Test Login (1 minute)

Open http://localhost:3000/login

#### Test as Super Admin
- Email: `admin@dmhca.com`
- Password: `password123`
- ✅ Should see all pages, all data, "Production Mode" badge

#### Test as Manager
Logout, then login as:
- Email: `sales.manager@dmhca.com`
- Password: `password123`
- ✅ Should see Users page, only Sales dept data

#### Test as Employee
Logout, then login as:
- Email: `john.sales@dmhca.com`
- Password: `password123`
- ✅ Should NOT see Users menu
- ✅ Should get "Access Denied" at /users

---

## ✅ What Works Now

- ✅ Login/Logout with JWT
- ✅ Role-based route protection
- ✅ Role-based navigation
- ✅ Database with 13 demo users
- ✅ Sample worksheets and reports
- ✅ Production mode (no demo)

## ⚠️ What's Pending

- ⚠️ Pages still show mock data (not from database)
- ⚠️ CRUD operations don't save to database
- ⚠️ No data filtering by role yet

**Next Step:** Implement backend controllers to connect pages to database

---

## 🆘 Troubleshooting

### Backend won't start
```powershell
# Check PostgreSQL
Get-Service postgresql*

# If not running
Start-Service postgresql-x64-15

# Verify database exists
psql -U postgres -l | findstr dmhca
```

### Login fails
```powershell
# Check if users were seeded
psql -U postgres -d dmhca_worksheets -c "SELECT COUNT(*) FROM users;"

# Should return: 13

# If 0, re-run seed
psql -U postgres -d dmhca_worksheets -f backend/database/seed.sql
```

### Port 5000 in use
```powershell
# Kill process
netstat -ano | findstr :5000
taskkill /PID <PID_FROM_ABOVE> /F
```

---

## 📖 More Help

- **Detailed Setup:** Read `PRODUCTION_SETUP.md`
- **Database Info:** Read `backend/database/README.md`
- **Architecture:** Read `README_PRODUCTION.md`
- **Status:** Read `IMPLEMENTATION_STATUS.md`

---

## 🎯 Demo Accounts Quick Reference

| Email | Password | Role | Can See |
|-------|----------|------|---------|
| admin@dmhca.com | password123 | Super Admin | Everything |
| sales.manager@dmhca.com | password123 | Dept Manager | Sales dept only |
| john.sales@dmhca.com | password123 | Employee | Own data only |

---

**🎉 That's it!** You now have authentication working with role hierarchy.

**Next:** Implement backend controllers to connect pages to database (see todo list in IMPLEMENTATION_STATUS.md)
