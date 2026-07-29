# Deployment Guide: Coaching Platform to Vercel + Railway

This guide walks you through deploying your NestJS backend + React frontend to production.

---

## Architecture Overview

```
Frontend (React/Vite)
  ↓
Vercel (vercel.com)

Backend (NestJS)
  ↓
Railway (railway.app) or Render (render.com)

Database (PostgreSQL)
  ↓
Railway PostgreSQL or Supabase
```

---

## Part 1: Set Up GitHub Repository

### 1.1 Initialize Git (if not already done)
```bash
cd d:\coaching
git init
git add .
git commit -m "Initial commit: Coaching platform with Malak Labidi profile"
```

### 1.2 Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click **New repository**
3. Name it `coaching-platform`
4. Set as **Public** (for Vercel to access)
5. Click **Create repository**

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/coaching-platform.git
git branch -M main
git push -u origin main
```

---

## Part 2: Frontend Deployment (Vercel)

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)

### 2.2 Create `vercel.json` for Frontend

Create this file in the **frontend** directory:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": {
      "default": "http://localhost:3000"
    }
  }
}
```

### 2.3 Update Frontend Environment Variables

Create `frontend/.env.production`:
```
VITE_API_URL=https://your-backend-url.railway.app
```

Update `frontend/src/services/api.ts` to use the environment variable:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  // ... rest of config
});
```

### 2.4 Deploy Frontend to Vercel
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **Add New → Project**
3. Select your `coaching-platform` GitHub repository
4. Click **Import**
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**

### 2.5 Get Vercel Frontend URL
After deployment completes, you'll see:
```
Frontend URL: https://coaching-platform.vercel.app
```

---

## Part 3: Database Setup (Railway PostgreSQL)

### 3.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### 3.2 Create PostgreSQL Database
1. Click **New Project**
2. Click **Provision PostgreSQL**
3. Click **PostgreSQL** → Create
4. Copy the **DATABASE_URL** from the **Variables** tab

Example:
```
postgresql://postgres:password@containers.railway.app:7729/railway
```

### 3.3 Run Prisma Migrations

```bash
# Set the production DATABASE_URL temporarily
$env:DATABASE_URL = "postgresql://postgres:password@containers.railway.app:7729/railway"

# Run migrations
cd backend
npx prisma migrate deploy

# Initialize coach profile (runs on backend startup)
```

---

## Part 4: Backend Deployment (Railway)

### 4.1 Create `railway.json` in Backend Root

Create `backend/railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json"
}
```

### 4.2 Create `backend/.env.production`

```
DATABASE_URL=postgresql://user:password@containers.railway.app:7729/railway
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
JWT_SECRET=your-production-secret-key-change-this
JWT_EXPIRATION=24h
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@coachingplatform.com
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URL=https://your-backend-url/google-calendar/callback
COACH_NAME=Malak Labidi
COACH_TITLE=Professeure de langue et de littérature françaises
COACH_EMAIL=hedid281@gmail.com
COACH_PHONE=+216 55 555 555
WHATSAPP_PHONE_NUMBER=+216 55 555 555
COACH_BIO=Je m'appelle Malak Labidi...
COACH_PHOTO_URL=/coach.jpg
COACH_EXPERTISE=Développement personnel, Croissance professionnelle...
COACH_EXPERIENCE_YEARS=25
COACH_CERTIFICATIONS=Professeure certifiée, Spécialiste en développement personnel
SESSION_DURATION_MINUTES=60
SESSION_BUFFER_MINUTES=15
ADMIN_EMAIL=hedid281@gmail.com
ADMIN_PASSWORD=Admin@123456
```

### 4.3 Update `backend/package.json`

Ensure these scripts exist:
```json
{
  "scripts": {
    "build": "nest build",
    "start": "node dist/main",
    "start:prod": "node dist/main"
  }
}
```

### 4.4 Create `backend/Procfile`

```
web: npm run start:prod
```

### 4.5 Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Click **New Project**
3. Click **Deploy from GitHub repo**
4. Select `coaching-platform` repository
5. Choose `backend` directory as root
6. Add environment variables from `.env.production`
7. Railway auto-deploys

### 4.6 Get Backend URL
After deployment, you'll see:
```
Backend URL: https://coaching-platform-prod.railway.app
```

---

## Part 5: Connect Frontend to Backend

### 5.1 Update Vercel Environment Variables
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your `coaching-platform` project
3. Go to **Settings → Environment Variables**
4. Add:
   ```
   VITE_API_URL = https://your-backend-url.railway.app
   ```
5. Redeploy: Click **Deployments** → Select latest → Click **Redeploy**

### 5.2 Update Backend CORS
Update `backend/.env.production`:
```
CORS_ORIGIN=https://your-frontend.vercel.app
```

Redeploy backend on Railway.

---

## Part 6: Custom Domain Setup

### 6.1 Buy a Domain
- Recommended: [Namecheap](https://www.namecheap.com), [GoDaddy](https://www.godaddy.com)
- Example: `coachingwithmalak.com`

### 6.2 Add Domain to Vercel Frontend

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings → Domains**
4. Click **Add Domain**
5. Enter your domain: `coachingwithmalak.com`
6. Follow DNS instructions (add CNAME record to your domain registrar)
7. Wait 5-10 minutes for DNS propagation

### 6.3 Add Subdomain for Backend (Optional)

If using custom domain:
1. At your domain registrar, create DNS record:
   ```
   Subdomain: api
   Type: CNAME
   Value: railway-backend-url.railway.app
   ```
2. Update backend CORS:
   ```
   CORS_ORIGIN=https://coachingwithmalak.com
   ```

---

## Part 7: Test Production Deployment

### 7.1 Test Frontend
```
Visit: https://coachingwithmalak.com
Should show Malak Labidi's profile in French
```

### 7.2 Test Backend API
```bash
curl https://your-backend-url/coach/profile
```
Should return:
```json
{
  "name": "Malak Labidi",
  "title": "Professeure de langue et de littérature françaises",
  "bio": "Je m'appelle Malak Labidi...",
  "photoUrl": "/coach.jpg"
}
```

### 7.3 Test Booking Flow
1. Visit frontend URL
2. Click "Réserver une session"
3. Book a session
4. Check admin dashboard: `/admin/login`

---

## Part 8: Production Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway
- [ ] PostgreSQL database created
- [ ] Environment variables set on both services
- [ ] CORS configured correctly
- [ ] Custom domain DNS configured
- [ ] Tested booking flow end-to-end
- [ ] Email notifications working (test from admin dashboard)
- [ ] SSL certificate installed (automatic with Vercel + Railway)
- [ ] Monitoring/logs accessible on both platforms

---

## Part 9: Monitoring & Maintenance

### Vercel
- Dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)
- View logs: Click project → **Functions** tab
- Auto-redeploy on git push

### Railway
- Dashboard: [railway.app](https://railway.app)
- View logs: Click project → **Logs** tab
- Monitor database: Click PostgreSQL → **Data** tab

### Email Setup
If Gmail gives authentication errors:
1. Enable 2FA on Gmail account
2. Generate App Password: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use App Password in `EMAIL_PASSWORD` environment variable

---

## Part 10: Troubleshooting

### Frontend not connecting to backend
- Check `VITE_API_URL` environment variable on Vercel
- Verify backend CORS includes frontend URL
- Check browser console for CORS errors

### Backend not starting
- Check Railway logs for errors
- Verify DATABASE_URL is correct
- Ensure `npm run build` succeeds locally first

### Database connection failing
- Verify DATABASE_URL format
- Check if Railway PostgreSQL is running
- Run migrations: `npx prisma migrate deploy`

### Email not sending
- Check EMAIL credentials in `.env.production`
- Generate new Gmail App Password
- Verify SMTP settings match Gmail requirements

---

## Cost Estimate (Free Tier)

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | Free | 100 GB bandwidth/month |
| Railway | Free | $5/month included credit, then pay-as-you-go |
| Supabase | Free | (if using instead of Railway DB) |
| Domain | ~$10/year | GoDaddy, Namecheap |
| **Total** | **~$10/year** | Very affordable! |

---

## Next Steps

1. ✅ Create GitHub repository
2. ✅ Deploy frontend to Vercel
3. ✅ Set up PostgreSQL on Railway
4. ✅ Deploy backend to Railway
5. ✅ Configure custom domain
6. ✅ Test production deployment
7. ✅ Monitor and maintain

**Estimated time: 30-45 minutes**

Good luck! 🚀
