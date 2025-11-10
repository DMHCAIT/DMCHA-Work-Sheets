# DMHCA Worksheets & Work Reports Portal

A comprehensive employee productivity and reporting platform for DMHCA's Sales, IT, Digital Marketing, and Administration departments.

## 🎯 Overview

This portal enables employees and managers to:
- Plan and track daily/weekly work through structured worksheets
- Submit time-tracked task progress with evidence
- Generate automated weekly/monthly reports
- Monitor department-specific KPIs and dashboards
- Manage approval workflows and audit trails

## 🏗️ Architecture

```
DMHCA-Work-Sheets/
├── backend/          # Node.js + Express + PostgreSQL
├── frontend/         # React + TypeScript + Tailwind CSS
└── docs/            # API docs, user guides, deployment guides
```

## 🚀 Tech Stack

### Backend
- **Runtime:** Node.js 18+ with Express.js
- **Database:** PostgreSQL 15+
- **Authentication:** JWT with bcrypt password hashing
- **ORM:** Prisma or TypeORM
- **File Storage:** Local/S3-compatible storage
- **Export:** ExcelJS (XLSX), csv-parser (CSV), PDFKit (PDF)

### Frontend
- **Framework:** React 18+ with TypeScript
- **UI Library:** Tailwind CSS + shadcn/ui components
- **State Management:** React Query + Zustand
- **Charts:** Recharts or Chart.js
- **Forms:** React Hook Form + Zod validation
- **Routing:** React Router v6

## 📋 Features by Role

### Admin
- User management (create, edit, deactivate)
- Role and permission assignment
- Department and template configuration
- System settings and audit log review

### Department Manager
- Approve/reject worksheets and reports
- Export department KPIs and analytics
- Review team performance metrics
- Access cross-team dashboards

### Team Lead
- Assign tasks to team members
- Review daily/weekly submissions
- Mark and resolve blockers
- Track team productivity

### Employee
- Fill daily/weekly worksheets
- Log time and task progress
- Attach files and evidence
- Request help on blockers

### Auditor (Read-Only)
- View all reports and logs
- Export compliance data
- Review approval histories

## 🔐 Security

- Username/password authentication with JWT tokens
- Bcrypt password hashing (12 rounds)
- Role-based access control (RBAC)
- OWASP Top 10 mitigations
- Encryption at rest and in transit (TLS 1.3)
- Comprehensive audit logging
- CSRF and XSS protection

## 📊 Department KPIs

### Sales
- Leads generated, demos scheduled, conversion rates
- Revenue, AOV, CAC, pipeline velocity

### Digital Marketing
- Sessions, CTR, CPL, ROAS, CAC
- MQL→SQL conversion rates

### IT
- Sprint velocity, cycle time, bug SLA
- System uptime, deployment frequency

### Administration
- Ticket SLA, procurement cycle time
- Budget vs actuals tracking

## 🗓️ Development Milestones

- **M1 (Weeks 1-3):** Authentication, RBAC, database setup
- **M2 (Weeks 4-5):** Worksheet management
- **M3 (Weeks 6-7):** Report generation and approvals
- **M4 (Weeks 8-9):** Dashboards and KPI tracking
- **M5 (Ongoing):** CRM/LMS/Payment integrations
- **M6 (Final 1-2 weeks):** QA, performance, security hardening

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL 15+
- Git

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure database connection in .env
npm run migrate
npm run seed
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Configure API endpoint in .env
npm run dev
```

### Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Default admin: username `admin` / password set during seed

## 📝 API Documentation

API documentation is available at `/api/docs` when running the backend server (Swagger/OpenAPI).

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

See `docs/deployment.md` for production deployment guides (Docker, AWS, Azure, etc.).

## 🔄 Data Retention

- Reports: 7 years (configurable)
- Raw worksheets: 2 years (configurable)
- Audit logs: 7 years (compliance)

## 📞 Support

For issues, feature requests, or questions, contact the DMHCA IT team.

## 📄 License

Proprietary - DMHCA Internal Use Only

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-07
