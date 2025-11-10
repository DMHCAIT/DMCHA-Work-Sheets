# DMHCA Worksheets Portal - API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### POST /auth/login

Login with username and password.

**Request Body:**
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@dmhca.com",
      "first_name": "System",
      "last_name": "Administrator",
      "role_name": "Admin",
      "permissions": {}
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "forcePasswordChange": false
  }
}
```

### POST /auth/refresh

Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

### POST /auth/logout

Logout and revoke refresh token.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

### POST /auth/change-password

Change current user's password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

### GET /auth/me

Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@dmhca.com",
    "first_name": "System",
    "last_name": "Administrator",
    "role_name": "Admin",
    "department_name": null,
    "permissions": {}
  }
}
```

---

## User Management Endpoints

### GET /users

Get all users (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `role` (string): Filter by role
- `department` (string): Filter by department
- `search` (string): Search by name or username

### POST /users

Create new user (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "username": "new.user",
  "password": "SecurePass@123",
  "email": "user@dmhca.com",
  "first_name": "John",
  "last_name": "Doe",
  "role_id": "role_uuid",
  "department_id": "dept_uuid",
  "manager_id": "manager_uuid"
}
```

### GET /users/:id

Get user by ID.

**Headers:** `Authorization: Bearer <token>`

### PUT /users/:id

Update user (Admin only).

**Headers:** `Authorization: Bearer <token>`

### DELETE /users/:id

Deactivate user (Admin only).

**Headers:** `Authorization: Bearer <token>`

---

## Worksheet Endpoints

### GET /worksheets

Get worksheets (filtered by user/department based on permissions).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status (draft, submitted, approved, etc.)
- `start_date` (date): Filter by date range start
- `end_date` (date): Filter by date range end
- `user_id` (uuid): Filter by user
- `department_id` (uuid): Filter by department

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Daily Sales Report",
      "work_date": "2025-11-07",
      "status": "submitted",
      "effort_hours": 8.0,
      "user": {
        "username": "john.sales",
        "first_name": "John",
        "last_name": "Smith"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50
  }
}
```

### POST /worksheets

Create new worksheet.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "template_id": "template_uuid",
  "title": "Daily Sales Report",
  "description": "Sales activities for Nov 7",
  "work_date": "2025-11-07",
  "start_time": "2025-11-07T09:00:00Z",
  "end_time": "2025-11-07T17:00:00Z",
  "effort_hours": 8.0,
  "priority": "medium",
  "tasks": [
    {
      "name": "Contact leads",
      "completed": true,
      "notes": "Called 15 leads"
    }
  ],
  "blockers": "No blockers",
  "outcomes": "Scheduled 3 demos"
}
```

### GET /worksheets/:id

Get worksheet by ID.

**Headers:** `Authorization: Bearer <token>`

### PUT /worksheets/:id

Update worksheet.

**Headers:** `Authorization: Bearer <token>`

### POST /worksheets/:id/submit

Submit worksheet for approval.

**Headers:** `Authorization: Bearer <token>`

### POST /worksheets/:id/approve

Approve worksheet (Manager only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "comment": "Approved. Good work!",
  "status": "approved"
}
```

---

## Report Endpoints

### GET /reports

Get reports.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`, `limit`: Pagination
- `report_type`: weekly, monthly, quarterly, annual
- `department_id`: Filter by department
- `start_date`, `end_date`: Date range

### POST /reports/generate

Generate report from worksheets.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Weekly Sales Report - Week 45",
  "report_type": "weekly",
  "start_date": "2025-11-01",
  "end_date": "2025-11-07",
  "department_id": "dept_uuid",
  "worksheet_ids": ["uuid1", "uuid2"]
}
```

### GET /reports/:id

Get report by ID.

**Headers:** `Authorization: Bearer <token>`

### GET /reports/:id/export

Export report in specified format.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `format`: xlsx, csv, or pdf

**Response:** File download

### POST /reports/:id/approve

Approve report (Manager only).

**Headers:** `Authorization: Bearer <token>`

---

## Dashboard Endpoints

### GET /dashboards/sales

Get Sales department KPIs.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `period`: 24h, 7d, 30d, 90d

**Response:**
```json
{
  "success": true,
  "data": {
    "leads_generated": 150,
    "demos_scheduled": 45,
    "conversion_rate": 12.5,
    "revenue": 125000,
    "aov": 2500,
    "cac": 150
  }
}
```

### GET /dashboards/it

Get IT department KPIs.

### GET /dashboards/marketing

Get Digital Marketing KPIs.

### GET /dashboards/administration

Get Administration KPIs.

### GET /dashboards/overview

Get organization-wide overview (Admin/Manager only).

---

## Department Endpoints

### GET /departments

Get all departments.

**Headers:** `Authorization: Bearer <token>`

### POST /departments

Create department (Admin only).

### GET /departments/:id

Get department by ID.

### PUT /departments/:id

Update department (Admin only).

---

## Audit Endpoints

### GET /audit

Get audit logs (Admin/Auditor only).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `userId`: Filter by user
- `action`: Filter by action type
- `entityType`: Filter by entity type
- `startDate`, `endDate`: Date range
- `page`, `limit`: Pagination

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user": {
        "username": "admin",
        "first_name": "System"
      },
      "action": "LOGIN",
      "entity_type": "user",
      "entity_id": "uuid",
      "ip_address": "192.168.1.1",
      "created_at": "2025-11-07T10:00:00Z"
    }
  ]
}
```

---

## Error Responses

All endpoints may return error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Optional validation errors
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

---

## Rate Limiting

API requests are rate-limited:
- **100 requests per 15 minutes** per IP address
- Exceeded limits return `429 Too Many Requests`

---

## Interactive Documentation

Visit `http://localhost:5000/api/docs` for interactive Swagger documentation with request/response examples and testing capabilities.
