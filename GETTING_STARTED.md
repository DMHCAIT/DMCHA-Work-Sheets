# DMHCA Worksheets & Work Reports Portal

## 🚀 Quick Start

This guide will help you get the DMHCA Worksheets Portal up and running in minutes.

### Prerequisites

- Node.js 18+ installed
- PostgreSQL 15+ installed
- Git installed

### Installation Steps

#### 1. Setup Database

```powershell
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE dmhca_worksheets;
\q
```

#### 2. Setup Backend

```powershell
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
notepad .env

# Run migrations
npm run migrate

# Seed initial data
npm run seed

# Start backend server
npm run dev
```

Backend API will be running at: `http://localhost:5000`

#### 3. Setup Frontend

```powershell
# Open new terminal
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start frontend
npm run dev
```

Frontend will be running at: `http://localhost:3000`

#### 4. Login

Open browser to `http://localhost:3000` and login with:

**Admin:**
- Username: `admin`
- Password: `Admin@123`

**Employee (Sales):**
- Username: `john.sales`
- Password: `Password@123`

## 📚 Documentation

- **[Setup Guide](docs/SETUP.md)** - Detailed installation instructions
- **[API Documentation](docs/API.md)** - Complete API reference
- **[Interactive API Docs](http://localhost:5000/api/docs)** - Swagger UI

## 🏗️ Project Structure

```
DMHCA-Work-Sheets/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Database, Swagger config
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth, error handling
│   │   ├── utils/          # Helpers, logger, auth
│   │   ├── database/       # Schema, migrations, seeds
│   │   └── server.js       # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API calls
│   │   ├── store/          # State management
│   │   └── main.jsx        # Entry point
│   ├── .env.example
│   └── package.json
│
├── docs/                   # Documentation
│   ├── SETUP.md           # Detailed setup guide
│   └── API.md             # API documentation
│
├── README.md              # This file
└── .gitignore
```

## 🎯 Key Features

### ✅ Phase 1 (M1) - Completed
- ✅ Username/password authentication with JWT
- ✅ Role-based access control (5 roles)
- ✅ PostgreSQL database with complete schema
- ✅ Audit logging system
- ✅ User management foundation
- ✅ API documentation with Swagger

### 🚧 Phase 2 (M2) - In Progress
- Worksheet management (templates, submissions)
- File attachments support
- Task tracking and time logging
- Status workflows

### 📅 Phase 3 (M3) - Planned
- Report generation (weekly/monthly)
- Approval workflows
- Export (XLSX, CSV, PDF)
- Change history

### 📊 Phase 4 (M4) - Planned
- Department dashboards
- KPI tracking and visualization
- Real-time analytics

## 🔐 Security Features

- JWT token authentication
- Bcrypt password hashing (12 rounds)
- Role-based permissions
- Audit trail for all actions
- Rate limiting (100 req/15min)
- OWASP Top 10 mitigations
- CSRF and XSS protection

## 👥 Default User Accounts

| Username | Password | Role | Department |
|----------|----------|------|------------|
| admin | Admin@123 | Admin | - |
| sales.manager | Password@123 | Dept Manager | Sales |
| it.manager | Password@123 | Dept Manager | IT |
| marketing.manager | Password@123 | Dept Manager | Digital Marketing |
| admin.manager | Password@123 | Dept Manager | Administration |
| john.sales | Password@123 | Employee | Sales |
| jane.dev | Password@123 | Employee | IT |
| auditor | Password@123 | Auditor | - |

⚠️ **Change all passwords immediately after first login!**

## 📋 Roles & Permissions

### Admin
- Full system access
- User management
- System configuration
- All reports and analytics

### Department Manager
- Approve/reject worksheets and reports
- Export department data
- View team performance
- Access department dashboard

### Team Lead
- Assign tasks to team members
- Review submissions
- Mark and resolve blockers
- Track team productivity

### Employee
- Create/edit worksheets
- Log time and tasks
- Attach files and evidence
- Request help on blockers

### Auditor (Read-Only)
- View all reports and logs
- Export compliance data
- Review audit trails

## 🛠️ Development Commands

### Backend
```powershell
npm run dev          # Start dev server
npm run migrate      # Run migrations
npm run seed         # Seed data
npm test             # Run tests
npm run lint         # Lint code
```

### Frontend
```powershell
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview build
npm run lint         # Lint code
```

## 📊 Department KPIs

### Sales
- Leads, demos, conversions
- Revenue, AOV, CAC
- Pipeline velocity

### IT
- Sprint velocity, cycle time
- Bug SLA, uptime
- Deployment frequency

### Digital Marketing
- Sessions, CTR, CPL
- ROAS, CAC
- MQL→SQL conversion

### Administration
- Ticket SLA
- Procurement cycle time
- Budget vs actuals

## 🐛 Troubleshooting

**Database connection failed:**
```powershell
# Verify PostgreSQL is running
Get-Service postgresql*

# Check database exists
psql -U postgres -l
```

**Port already in use:**
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `frontend/vite.config.js`

**Can't login:**
- Verify backend is running
- Check browser console for errors
- Verify database has seeded users

## 🔄 Data Retention

- **Reports:** 7 years (configurable)
- **Worksheets:** 2 years (configurable)
- **Audit logs:** 7 years (compliance)

## 📦 Tech Stack

**Backend:**
- Node.js 18+ with Express.js
- PostgreSQL 15+
- JWT authentication
- Bcrypt password hashing
- Winston logging
- Swagger API docs

**Frontend:**
- React 18+ with Vite
- Tailwind CSS
- React Query (data fetching)
- Zustand (state management)
- React Router v6
- Recharts (visualizations)

## 🚀 Next Steps

1. ✅ Complete setup following this guide
2. ✅ Login and change default passwords
3. ✅ Review role permissions in admin panel
4. ✅ Create worksheet templates for departments
5. ✅ Configure email settings for notifications
6. ✅ Review and test API endpoints
7. ✅ Begin Phase 2 development

## 📞 Support & Resources

- **API Docs:** http://localhost:5000/api/docs
- **Health Check:** http://localhost:5000/health
- **Setup Guide:** See `docs/SETUP.md`
- **API Reference:** See `docs/API.md`

## 📄 License

Proprietary - DMHCA Internal Use Only

---

**Document Version:** 1.0  
**Last Updated:** November 7, 2025  
**Status:** Phase 1 (M1) Complete ✅
