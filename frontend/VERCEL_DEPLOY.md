# Vercel Deployment Configuration for DMHCA Frontend

## Build Settings

**Framework Preset:** Vite

**Root Directory:** `frontend`

**Build Command:**
```
npm run build
```

**Output Directory:** `dist`

**Install Command:**
```
npm install
```

## Environment Variables

Add this in Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-name.onrender.com
```

**Important:** Replace `your-backend-name` with your actual Render backend URL after deployment.

## Deployment Steps

1. Go to vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variable: `VITE_API_URL`
6. Click "Deploy"

## After Deployment

1. Copy your Vercel URL (e.g., `https://dmhca-worksheets.vercel.app`)
2. Go to Render backend settings
3. Update `CORS_ORIGIN` environment variable with your Vercel URL
4. Redeploy backend
