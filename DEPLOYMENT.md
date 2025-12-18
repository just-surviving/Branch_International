# Deployment Guide

## Quick Deploy (Free Tier)

### Option 1: Render (Backend + DB) + Vercel (Frontend)

#### Step 1: Deploy Backend on Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click **New** → **Blueprint**
3. Connect your GitHub repo: `just-surviving/Branch_International`
4. Select the repo and Render will auto-detect `render.yaml`
5. Click **Apply** to deploy
6. Wait for PostgreSQL and Backend to deploy (~5-10 minutes)
7. Copy the backend URL (e.g., `https://branch-backend-xxxx.onrender.com`)

#### Step 2: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login with GitHub
2. Click **Add New** → **Project**
3. Import `just-surviving/Branch_International`
4. Configure:
   - **Root Directory**: `branch-messaging-platform/frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   - `VITE_API_URL` = `https://your-render-backend-url.onrender.com`
   - `VITE_WS_URL` = `https://your-render-backend-url.onrender.com`
6. Click **Deploy**

#### Step 3: Update Render Backend with Frontend URL

1. Go to Render Dashboard → branch-backend → Environment
2. Update `FRONTEND_URL` to your Vercel URL (e.g., `https://branch-messaging.vercel.app`)
3. Trigger a redeploy

---

### Option 2: Railway (All-in-One)

1. Go to [railway.app](https://railway.app) and sign up
2. Click **New Project** → **Deploy from GitHub repo**
3. Select `just-surviving/Branch_International`
4. Railway will auto-detect the services
5. Add PostgreSQL: **New** → **Database** → **PostgreSQL**
6. Link the database to backend service
7. Set environment variables:
   - `DATABASE_URL`: (auto-linked from PostgreSQL)
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: (your frontend URL)

---

## Environment Variables Reference

### Backend (Render/Railway)
```
DATABASE_URL=postgresql://user:password@host:5432/database
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend-url.onrender.com
VITE_WS_URL=https://your-backend-url.onrender.com
```

---

## Post-Deployment Checklist

- [ ] Backend health check: `https://your-backend-url/health`
- [ ] Database connected (check health endpoint)
- [ ] Frontend loads login page
- [ ] Agent login works
- [ ] Conversations load
- [ ] Real-time messaging works (WebSocket)

---

## Troubleshooting

### WebSocket Connection Failed
- Ensure `VITE_WS_URL` points to the correct backend
- Check Render logs for CORS errors
- Verify `FRONTEND_URL` includes your Vercel domain

### Database Connection Issues
- Check `DATABASE_URL` is correctly set
- Ensure PostgreSQL is running on Render
- Run migrations: Check Render logs for "Prisma migrate"

### Build Failures
- Check Node.js version (requires 18+)
- Verify all dependencies are in package.json
- Check TypeScript errors in build logs

---

## Scaling (When Needed)

### Render
- Upgrade from Free to Starter ($7/month) for:
  - No sleep after 15 min inactivity
  - Better performance
  - Custom domains

### Vercel
- Free tier is usually sufficient
- Pro ($20/month) for:
  - More bandwidth
  - Team features
  - Advanced analytics
