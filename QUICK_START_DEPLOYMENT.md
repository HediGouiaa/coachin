# Quick Start Deployment Checklist

Follow these steps in order to deploy your coaching platform to production.

---

## ✅ Step 1: Prepare Local Repository (5 minutes)

```bash
cd d:\coaching

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: Coaching platform"
```

---

## ✅ Step 2: Create GitHub Repository (5 minutes)

1. Go to [github.com](https://github.com)
2. Click **New repository**
3. Name: `coaching-platform`
4. Set as **Public** (required for Vercel)
5. Create repository
6. Copy the URL (e.g., `https://github.com/YOUR_USERNAME/coaching-platform.git`)

```bash
git remote add origin https://github.com/YOUR_USERNAME/coaching-platform.git
git branch -M main
git push -u origin main
```

---

## ✅ Step 3: Deploy Frontend to Vercel (10 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **Add New → Project**
4. Select `coaching-platform` repository
5. Configure:
   - Root Directory: `frontend`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variables:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.railway.app` (you'll get this in step 5)
7. Click **Deploy**

**Your frontend URL:**
```
https://coaching-platform.vercel.app
```

---

## ✅ Step 4: Set Up Database on Railway (10 minutes)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **New Project** → **Provision PostgreSQL**
4. Copy the DATABASE_URL from Variables tab

Example:
```
postgresql://postgres:password@containers.railway.app:7729/railway
```

---

## ✅ Step 5: Deploy Backend to Railway (10 minutes)

1. On Railway, click **New Project** → **Deploy from GitHub**
2. Select `coaching-platform` repository
3. Configure:
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Start Command: `npm run start:prod`
4. Add Environment Variables (copy from backend/.env.production and update):
   ```
   DATABASE_URL=postgresql://postgres:password@containers.railway.app:7729/railway
   CORS_ORIGIN=https://coaching-platform.vercel.app
   JWT_SECRET=your-secret-key-min-32-chars
   EMAIL_USER=hedid281@gmail.com
   EMAIL_PASSWORD=your-app-password
   (copy other values from .env.production)
   ```
5. Deploy

**Your backend URL:**
```
https://coaching-platform-prod.railway.app
```

---

## ✅ Step 6: Update Frontend with Backend URL (5 minutes)

1. Go to Vercel Dashboard → Select project
2. Go to **Settings → Environment Variables**
3. Update `VITE_API_URL`:
   ```
   VITE_API_URL=https://coaching-platform-prod.railway.app
   ```
4. Redeploy: Click **Deployments** → Select latest → **Redeploy**

---

## ✅ Step 7: Run Database Migrations (5 minutes)

```bash
# In backend directory
$env:DATABASE_URL = "postgresql://postgres:password@containers.railway.app:7729/railway"
npx prisma migrate deploy
```

---

## ✅ Step 8: Test Production (5 minutes)

Visit your frontend URL:
```
https://coaching-platform.vercel.app
```

Check:
- [ ] Malak Labidi's profile displays
- [ ] French translations show
- [ ] Coach image loads
- [ ] "Réserver une session" button works
- [ ] Booking form submits successfully
- [ ] Admin dashboard accessible at `/admin/login`

API test:
```bash
curl https://coaching-platform-prod.railway.app/coach/profile
```

Should return Malak Labidi's profile data.

---

## ✅ Step 9: Add Custom Domain (Optional, 15 minutes)

### 9.1 Buy Domain
- [Namecheap](https://www.namecheap.com)
- [GoDaddy](https://www.godaddy.com)
- [Google Domains](https://domains.google.com)

Example: `coachingwithmalak.com`

### 9.2 Configure Vercel Domain
1. Vercel Dashboard → Project → **Settings → Domains**
2. Enter your domain
3. Add CNAME record at your domain registrar pointing to Vercel
4. Wait 5-10 minutes for DNS propagation

Your site will be live at:
```
https://coachingwithmalak.com
```

---

## ✅ Step 10: Update Environment Variables for Domain (5 minutes)

**Backend (Railway):**
1. Add your custom domain to CORS_ORIGIN
   ```
   CORS_ORIGIN=https://coachingwithmalak.com
   ```
2. Redeploy

**Frontend (Vercel):**
1. VITE_API_URL should already be set (backend URL doesn't need updating)

---

## 🎉 You're Live!

Your coaching platform is now live at:
- **Frontend:** https://coachingwithmalak.com
- **Backend API:** https://coaching-platform-prod.railway.app

---

## Estimated Costs (Free Tier)

- **Vercel:** FREE (100 GB bandwidth/month)
- **Railway:** FREE with $5/month credit included
- **Domain:** ~$10/year
- **Total:** ~$10/year

---

## Monitoring & Support

### Vercel Logs
- Dashboard: https://vercel.com/dashboard
- Click project → **Functions** tab

### Railway Logs
- Dashboard: https://railway.app
- Click project → **Logs** tab

### Email Issues
If Gmail authentication fails:
1. Enable 2FA on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Update EMAIL_PASSWORD in environment variables

---

## Troubleshooting

**Frontend not loading backend:**
- Check VITE_API_URL on Vercel
- Verify backend CORS includes your domain
- Check browser console (F12) for errors

**Backend not starting:**
- Check Railway logs for errors
- Verify DATABASE_URL is correct
- Run migrations: `npx prisma migrate deploy`

**Database empty:**
- Run migrations: `npx prisma migrate deploy`
- Coach profile auto-initializes on first run

---

**Total Setup Time: ~60 minutes**

Need help? See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.
