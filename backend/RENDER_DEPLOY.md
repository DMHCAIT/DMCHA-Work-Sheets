# Render.com Deployment Configuration for DMHCA Backend

## Build Settings

**Environment:** Node

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

**Branch:** main (or master)

## Environment Variables

Add these in Render Dashboard → Environment:

```
NODE_ENV=production
PORT=5000

# Supabase Configuration
SUPABASE_URL=https://hnymialotvmtzyeignex.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhueW1pYWxvdHZtdHp5ZWlnbmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NzMzMzMsImV4cCI6MjA3ODM0OTMzM30.2oJSDsXAX3ewnQdE92g2izWBRWafWmfHibECRC4hVA4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhueW1pYWxvdHZtdHp5ZWlnbmV4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc3MzMzMywiZXhwIjoyMDc4MzQ5MzMzfQ.zRLXjQiuUGBktLNqrSiKKQBjbBxMkKWGwPxF7VJV1Io

# Database Configuration
DB_HOST=db.hnymialotvmtzyeignex.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=QaSL5iyaYD0dEYp9
DB_SSL=true

# JWT Authentication
JWT_SECRET=p1yfWBQLLqPHCYucmn3/MRppx8JnWvs3DaC8CYWlsje++10b2TghuRQXSniC7GKMMTpbYiVuBRrM+n0H+ihY3g==
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=12

# CORS - UPDATE THIS AFTER VERCEL DEPLOYMENT
CORS_ORIGIN=https://your-app-name.vercel.app,http://localhost:3000

# API
API_BASE_URL=https://your-backend-name.onrender.com
```

## Important Notes

1. **After Vercel deployment**, update `CORS_ORIGIN` with your actual Vercel URL
2. **After Render gives you URL**, update `API_BASE_URL`
3. Keep `http://localhost:3000` for local development
