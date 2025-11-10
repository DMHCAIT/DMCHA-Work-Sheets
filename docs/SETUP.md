# DMHCA Worksheets Portal - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v15 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- **npm** or **yarn** package manager

## Step 1: Database Setup

### Windows (PostgreSQL)

1. **Install PostgreSQL** on Windows
2. **Create Database:**
   ```powershell
   # Open PostgreSQL shell (psql)
   # Login as postgres user
   psql -U postgres
   
   # Create database
   CREATE DATABASE dmhca_worksheets;
   
   # Exit psql
   \q
   ```

3. **Verify Connection:**
   ```powershell
   psql -U postgres -d dmhca_worksheets
   ```

## Step 2: Backend Setup

1. **Navigate to backend directory:**
   ```powershell
   cd backend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Configure environment:**
   ```powershell
   # Copy example env file
   cp .env.example .env
   
   # Edit .env file with your settings
   notepad .env
   ```

4. **Update `.env` file with your database credentials:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=dmhca_worksheets
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   
   JWT_SECRET=your-random-secret-key-here
   ```

5. **Run database migrations:**
   ```powershell
   npm run migrate
   ```

6. **Seed initial data:**
   ```powershell
   npm run seed
   ```

7. **Start backend server:**
   ```powershell
   npm run dev
   ```

   The backend API should now be running on `http://localhost:5000`

## Step 3: Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
   ```powershell
   cd frontend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Configure environment:**
   ```powershell
   # Copy example env file
   cp .env.example .env
   
   # Edit if needed (default should work)
   notepad .env
   ```

4. **Start frontend development server:**
   ```powershell
   npm run dev
   ```

   The frontend should now be running on `http://localhost:3000`

## Step 4: Access the Application

1. **Open your browser** and navigate to `http://localhost:3000`

2. **Login with default credentials:**
   - **Admin Account:**
     - Username: `admin`
     - Password: `Admin@123`
   
   - **Sales Employee:**
     - Username: `john.sales`
     - Password: `Password@123`
   
   - **IT Employee:**
     - Username: `jane.dev`
     - Password: `Password@123`

3. **⚠️ IMPORTANT:** Change all default passwords after first login!

## Step 5: Verify Installation

### Check Backend API

1. Visit API documentation: `http://localhost:5000/api/docs`
2. Test health endpoint: `http://localhost:5000/health`

### Check Database

```powershell
# Connect to database
psql -U postgres -d dmhca_worksheets

# List all tables
\dt

# Check users
SELECT username, role_id FROM users;

# Exit
\q
```

## Default Users Created

| Username | Password | Role | Department |
|----------|----------|------|------------|
| admin | Admin@123 | Admin | - |
| sales.manager | Password@123 | Department Manager | Sales |
| it.manager | Password@123 | Department Manager | IT |
| marketing.manager | Password@123 | Department Manager | Digital Marketing |
| admin.manager | Password@123 | Department Manager | Administration |
| john.sales | Password@123 | Employee | Sales |
| jane.dev | Password@123 | Employee | IT |
| auditor | Password@123 | Auditor | - |

## Troubleshooting

### Backend won't start

**Error: "Database connection failed"**
- Verify PostgreSQL is running: `Get-Service postgresql*`
- Check database credentials in `.env`
- Ensure database exists: `psql -U postgres -l`

**Error: "Port 5000 already in use"**
- Change port in `backend/.env`: `PORT=5001`
- Update frontend API URL: `frontend/.env`: `VITE_API_URL=http://localhost:5001/api`

### Frontend won't start

**Error: "Port 3000 already in use"**
- Kill the process or change port in `vite.config.js`

**Error: "Cannot connect to API"**
- Verify backend is running on port 5000
- Check `frontend/.env` has correct `VITE_API_URL`

### Database migration fails

```powershell
# Drop and recreate database
psql -U postgres

DROP DATABASE IF EXISTS dmhca_worksheets;
CREATE DATABASE dmhca_worksheets;
\q

# Run migrations again
cd backend
npm run migrate
npm run seed
```

## Development Commands

### Backend
```powershell
cd backend
npm run dev          # Start development server
npm run migrate      # Run database migrations
npm run seed         # Seed initial data
npm test             # Run tests
npm run lint         # Lint code
```

### Frontend
```powershell
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
```

## Next Steps

1. ✅ **Change default passwords** for all users
2. ✅ **Review role permissions** in Admin panel
3. ✅ **Create worksheet templates** for your departments
4. ✅ **Configure email settings** for notifications
5. ✅ **Set up backup schedule** (see deployment guide)

## Additional Resources

- **API Documentation:** http://localhost:5000/api/docs
- **PRD Document:** See `README.md` in root directory
- **Deployment Guide:** See `docs/deployment.md`

## Support

For issues or questions:
- Check the troubleshooting section above
- Review API documentation
- Contact DMHCA IT team

---

**Important Security Notes:**
- Never commit `.env` files to version control
- Change all default passwords immediately
- Use strong JWT secrets in production
- Enable SSL/TLS for production deployment
