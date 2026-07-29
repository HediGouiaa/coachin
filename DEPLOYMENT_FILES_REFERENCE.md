# Deployment Files Reference

This file explains all the deployment-related files created for your project.

---

## Configuration Files

### `frontend/vercel.json`
**Purpose:** Tells Vercel how to build and deploy your React app
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/:path*", "destination": "/index.html" }]
}
```
- Builds with `npm run build`
- Outputs to `dist` folder
- Rewrites all routes to index.html for React Router

### `backend/railway.json`
**Purpose:** Tells Railway how to build and run your NestJS app
- Uses nixpacks builder
- Build command: `npm run build`
- Start command: `npm run start:prod`

### `backend/Procfile`
**Purpose:** Legacy deployment configuration (used by some services)
```
web: npm run start:prod
```

---

## Environment Configuration Files

### `frontend/.env.production`
**Purpose:** Frontend environment variables for production
```
VITE_API_URL=https://your-backend-url.railway.app
```
- Tells React where to find the backend API
- Different from development `.env` which points to localhost:3000

### `backend/.env.production`
**Purpose:** Backend environment variables for production
Contains:
- Database URL for production PostgreSQL
- CORS origin (frontend URL)
- JWT secret (should be strong in production)
- Email credentials
- Coach profile information
- Admin credentials

---

## Git Configuration

### `.gitignore`
**Purpose:** Prevents sensitive files from being committed
```
.env                    # Development env vars (NEVER commit!)
.env.production         # ✅ OK to commit (has placeholders)
node_modules/
dist/
.vscode/
```

**Note:** `.env.production` is tracked so you can see the structure, but you'll replace actual values in Vercel/Railway dashboards.

---

## Deployment Architecture

```
Your Computer (Local Development)
    ↓
GitHub Repository (Free tier)
    ↓
┌───────────────────────────────────────┐
│                                       │
│   Vercel (Frontend)          Railway  │
│   ├─ React/Vite             ├─ NestJS│
│   ├─ Builds from git        ├─ Builds│
│   ├─ Auto-deploys on push   └─ from git
│   ├─ Hosting included       
│   └─ SSL free               PostgreSQL
│                             ├─ Railway
│   ↕ API Calls              ├─ Free tier
│                             └─ Auto backup
│
└───────────────────────────────────────┘
         ↓ (Optional)
    Custom Domain
    (coachingwithmalak.com)
```

---

## File Structure After Deployment Setup

```
coaching/
├── .git/                           # Git history
├── .gitignore                      # ✅ NEW: Git ignore rules
├── DEPLOYMENT_GUIDE.md             # ✅ NEW: Detailed guide
├── QUICK_START_DEPLOYMENT.md       # ✅ NEW: Quick checklist
├── frontend/
│   ├── vercel.json                # ✅ NEW: Vercel config
│   ├── .env.production            # ✅ NEW: Production env vars
│   ├── vite.config.ts
│   ├── package.json
│   └── src/
├── backend/
│   ├── railway.json               # ✅ NEW: Railway config
│   ├── Procfile                   # ✅ NEW: Start command
│   ├── .env                       # Development (not committed)
│   ├── .env.production            # ✅ NEW: Production template
│   ├── package.json
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
└── README.md
```

---

## Environment Variable Hierarchy

### Development (Local)
- Source: `backend/.env`
- URL: `http://localhost:3000`
- Database: Local PostgreSQL
- Used when: `npm run start:dev`

### Production (Vercel/Railway)
- Source: Dashboard environment variables
- URL: `https://backend-url.railway.app`
- Database: Production PostgreSQL (Railway)
- Used when: Deployed on Vercel/Railway

### Template (For Reference)
- Source: `backend/.env.production`
- Contains: All keys needed for production
- Used for: Knowing what to configure

---

## Security Best Practices

✅ **DO:**
- Commit: `.env.production` (template only)
- Store secrets: In Vercel/Railway dashboards
- Use: Strong JWT secrets (min 32 chars)
- Generate: Gmail App Passwords (not real password)
- Rotate: Secrets quarterly

❌ **DON'T:**
- Commit: `.env` files with real credentials
- Share: Production secrets in chat/email
- Use: Same secret as development
- Push: Real passwords to GitHub

---

## Verifying Deployment Files

### Check Vercel Configuration
```bash
cat frontend/vercel.json
```
Should show:
- buildCommand: `npm run build`
- outputDirectory: `dist`

### Check Railway Configuration
```bash
cat backend/railway.json
```
Should show:
- Build and deploy commands
- nixpacks builder

### Check Production Environment Variables
```bash
cat backend/.env.production
```
Should show:
- Placeholder values (not real secrets)
- All required configuration keys

---

## Deployment Checklist

Before deploying, verify:

- [ ] `frontend/vercel.json` exists
- [ ] `backend/railway.json` exists
- [ ] `backend/Procfile` exists
- [ ] `frontend/.env.production` exists
- [ ] `backend/.env.production` exists (with placeholders)
- [ ] `.gitignore` prevents .env from being committed
- [ ] `package.json` has build/start scripts
- [ ] Git repository is initialized and pushed
- [ ] No `.env.development` file committed with real secrets
- [ ] Frontend `api.ts` uses `VITE_API_URL` environment variable

---

## File Purposes Summary

| File | Purpose | Committed? | Real Values? |
|------|---------|-----------|-------------|
| `.env` | Dev environment | ❌ No | ✅ Yes (local only) |
| `.env.production` | Production template | ✅ Yes | ❌ Placeholders only |
| `vercel.json` | Vercel build config | ✅ Yes | N/A |
| `railway.json` | Railway build config | ✅ Yes | N/A |
| `Procfile` | Start command | ✅ Yes | N/A |
| `.gitignore` | Ignore rules | ✅ Yes | N/A |

---

## Next Steps

1. Review [QUICK_START_DEPLOYMENT.md](./QUICK_START_DEPLOYMENT.md) for step-by-step instructions
2. Create Vercel account at vercel.com
3. Create Railway account at railway.app
4. Push to GitHub: `git push -u origin main`
5. Connect Vercel to GitHub repository
6. Deploy!

Total setup time: ~60 minutes
