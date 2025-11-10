# 🚀 COMPLETE DEPLOYMENT GUIDE
## DMHCA Worksheets Portal - Render + Vercel

---

## 📋 PRE-DEPLOYMENT CHECKLIST

Before deploying, make sure:

- [ ] ✅ Code is pushed to GitHub
- [ ] ✅ Supabase database is set up (SQL file executed)
- [ ] ✅ All environment variables are ready
- [ ] ✅ Backend runs locally without errors
- [ ] ✅ Frontend runs locally without errors

---

## 🔥 DEPLOYMENT ORDER

**IMPORTANT:** Deploy in this order:
1. **Backend First** (Render) → Get backend URL
2. **Frontend Second** (Vercel) → Use backend URL
3. **Update CORS** → Add frontend URL to backend

---

## PART 1: DEPLOY BACKEND TO RENDER

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select the repository containing your project

### Step 3: Configure Build Settings

Fill in these settings:

```
Name: dmhca-backend (or your choice)
Region: Singapore (or closest to you)
Branch: main (or master)
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add each of these (copy from backend/.env):

```
NODE_ENV=production
PORT=5000

SUPABASE_URL=https://hnymialotvmtzyeignex.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhueW1pYWxvdHZtdHp5ZWlnbmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NzMzMzMsImV4cCI6MjA3ODM0OTMzM30.2oJSDsXAX3ewnQdE92g2izWBRWafWmfHibECRC4hVA4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhueW1pYWxvdHZtdHp5ZWlnbmV4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc3MzMzMywiZXhwIjoyMDc4MzQ5MzMzfQ.zRLXjQiuUGBktLNqrSiKKQBjbBxMkKWGwPxF7VJV1Io

DB_HOST=db.hnymialotvmtzyeignex.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=QaSL5iyaYD0dEYp9
DB_SSL=true

JWT_SECRET=p1yfWBQLLqPHCYucmn3/MRppx8JnWvs3DaC8CYWlsje++10b2TghuRQXSniC7GKMMTpbYiVuBRrM+n0H+ihY3g==
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_ROUNDS=12

CORS_ORIGIN=http://localhost:3000
```

**Note:** We'll update `CORS_ORIGIN` after deploying frontend.

### Step 5: Deploy Backend

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. You'll get a URL like: `https://dmhca-backend.onrender.com`
4. **SAVE THIS URL** - you need it for frontend!

### Step 6: Test Backend

Open in browser:
```
https://dmhca-backend.onrender.com/api/health
```

Should return: `{"status":"OK"}`

---

## PART 2: DEPLOY FRONTEND TO VERCEL

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

### Step 2: Import Project
1. Click **"Add New"** → **"Project"**
2. Import your GitHub repository
3. Select your repository

### Step 3: Configure Project Settings

```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Step 4: Add Environment Variable

Click **"Environment Variables"**:

```
Name: VITE_API_URL
Value: https://dmhca-backend.onrender.com/api
```

**Replace** `dmhca-backend` with your actual Render backend URL!

### Step 5: Deploy Frontend

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. You'll get a URL like: `https://dmhca-worksheets.vercel.app`
4. **SAVE THIS URL**

### Step 6: Test Frontend

1. Open your Vercel URL
2. Try to login with: `admin` / `password123`
3. If CORS error appears, continue to Part 3

---

## PART 3: UPDATE CORS IN BACKEND

### Step 1: Update Environment Variable

1. Go back to Render dashboard
2. Click your backend service
3. Go to **"Environment"**
4. Find `CORS_ORIGIN` variable
5. Update value to:
   ```
   https://your-vercel-app.vercel.app,http://localhost:3000
   ```
   (Replace with your actual Vercel URL)

### Step 2: Redeploy Backend

1. Go to **"Manual Deploy"** → **"Deploy latest commit"**
2. Wait 2-3 minutes
3. Backend will restart with new CORS settings

### Step 3: Test Complete System

1. Open your Vercel URL
2. Login with: `admin` / `password123`
3. Check Dashboard loads real data
4. ✅ **DEPLOYMENT COMPLETE!**

---

## 🎉 POST-DEPLOYMENT

### Your Live URLs

**Frontend:** `https://your-app.vercel.app`
**Backend:** `https://your-backend.onrender.com`
**Database:** Already on Supabase ✅

### Test Checklist

- [ ] Frontend loads without errors
- [ ] Can login successfully
- [ ] Dashboard shows real data from Supabase
- [ ] No CORS errors in browser console
- [ ] API calls working (check Network tab)

---

## 🔧 TROUBLESHOOTING

### Issue: CORS Error
**Solution:** Make sure backend `CORS_ORIGIN` includes your Vercel URL

### Issue: 500 Error on Login
**Solution:** Check backend logs in Render dashboard for database errors

### Issue: API Calls Failing
**Solution:** Verify `VITE_API_URL` in Vercel environment variables

### Issue: Backend Sleeping (Free Tier)
**Note:** Render free tier sleeps after 15 min. First request takes ~30s to wake up.

---

## 💰 COSTS

**Current Setup:**
- Render (Free): $0/month (sleeps after 15 min inactivity)
- Vercel (Free): $0/month (unlimited bandwidth for hobby)
- Supabase (Free): $0/month (500MB database)

**Total: $0/month** 🎉

**To Upgrade:**
- Render (Always On): $7/month
- Vercel Pro: $20/month (optional)
- Supabase Pro: $25/month (for more storage)

---

## 📝 CONFIGURATION FILES CREATED

✅ `backend/RENDER_DEPLOY.md` - Render deployment guide
✅ `frontend/VERCEL_DEPLOY.md` - Vercel deployment guide
✅ `frontend/.env.development` - Local development config
✅ `frontend/.env.production` - Production config
✅ `backend/src/server.js` - Updated with production CORS

---

## 🚀 QUICK DEPLOYMENT COMMANDS

### Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Local Testing Before Deploy
```bash
# Backend
cd backend
npm start

# Frontend (new terminal)
cd frontend
npm run dev
```

---

## ✅ FINAL CHECKLIST

Before going live:

- [ ] Database tables created in Supabase
- [ ] Backend deployed to Render
- [ ] Backend URL saved
- [ ] Frontend deployed to Vercel with correct API URL
- [ ] CORS updated in backend with Vercel URL
- [ ] Backend redeployed after CORS update
- [ ] Tested login on production
- [ ] Tested Dashboard on production

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT

1. Share live URL with team
2. Monitor Render logs for errors
3. Set up custom domain (optional)
4. Enable analytics (optional)
5. Set up monitoring/alerts

---

**Ready to deploy? Follow the steps in order!**

Need help? Check the individual deployment guides:
- `backend/RENDER_DEPLOY.md`
- `frontend/VERCEL_DEPLOY.md`
