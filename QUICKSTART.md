# 🚀 Coaching Platform - Quick Start Guide

## Project Overview

This is a **complete, production-ready coaching platform** with:
- ✅ Modern responsive frontend (React + Vite + Tailwind CSS)
- ✅ Robust backend API (NestJS + PostgreSQL)
- ✅ Real-time booking system with calendar integration
- ✅ Email notifications (Gmail SMTP)
- ✅ Google Calendar sync
- ✅ WhatsApp integration
- ✅ Admin dashboard with full management

---

## 📁 Project Structure

```
d:\coaching\
├── backend/                  ← NestJS API
├── frontend/                 ← React frontend  
├── README.md                 ← Full documentation
└── .env.example              ← Environment template
```

---

## 🎯 What's Included

### Backend (NestJS)
✅ Authentication (JWT)
✅ Coach profile management  
✅ Booking/reservation system
✅ Weekly availability scheduling
✅ Email notifications
✅ Google Calendar integration
✅ Special events management
✅ Prisma ORM + PostgreSQL

### Frontend (React)
✅ Home page with coach profile
✅ Multi-step booking form
✅ Real-time calendar with available slots
✅ Events listing
✅ Admin login
✅ Complete admin dashboard:
  - Booking management
  - Availability management
  - Events management
  - Profile settings
  - Statistics dashboard

---

## ⚡ Quick Start (5 Minutes)

### 1. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env and set:
# - DATABASE_URL (PostgreSQL connection)
# - EMAIL credentials (Gmail)
# - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET (optional)
# - COACH information

# Run database setup
npx prisma generate
npx prisma db push

# Start backend
npm run start:dev
# Backend runs on http://localhost:3000
```

### 2. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env and set:
# - VITE_API_URL=http://localhost:3000
# - VITE_WHATSAPP_NUMBER (your WhatsApp)

# Start frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### 3. Access the App

- **Home**: http://localhost:5173
- **Book Session**: http://localhost:5173/booking
- **Events**: http://localhost:5173/events
- **Admin Login**: http://localhost:5173/admin/login
- **Admin Dashboard**: http://localhost:5173/admin/dashboard

### 4. Default Admin Credentials

```
Email: admin@coachingplatform.com
Password: Admin@123456
```
*(Change these in production!)*

---

## 📊 Database Setup

### PostgreSQL Connection

The system requires PostgreSQL. Quick setup:

**Option 1: Docker**
```bash
docker run --name coaching-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

**Option 2: Local PostgreSQL**
```bash
# Windows: Download from https://www.postgresql.org/download/windows/
# After install, update DATABASE_URL in .env
```

### Create Database

```bash
npx prisma db push
# or if you want to create migrations:
npx prisma migrate dev --name init
```

---

## 🔑 Key Features Overview

### Public Pages
1. **Home (/)** - Coach profile showcase
2. **Booking (/booking)** - Multi-step booking wizard
3. **Events (/events)** - Upcoming events listing

### Admin Dashboard (/admin/dashboard)
1. **Overview** - Statistics and today's sessions
2. **Bookings** - Confirm/cancel/manage bookings
3. **Availability** - Set weekly schedule
4. **Events** - Create and manage events
5. **Profile** - Edit coach information

---

## 🔧 Environment Variables Checklist

### Backend (.env)
- [ ] DATABASE_URL - PostgreSQL connection string
- [ ] JWT_SECRET - Random secret key
- [ ] EMAIL_USER, EMAIL_PASSWORD - Gmail credentials
- [ ] GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET (optional)
- [ ] COACH_NAME, COACH_EMAIL, etc.

### Frontend (.env)
- [ ] VITE_API_URL - Backend URL (http://localhost:3000)
- [ ] VITE_WHATSAPP_NUMBER - Your WhatsApp number

---

## 📝 API Endpoints

### Authentication
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `GET /auth/profile` - Get profile

### Booking
- `POST /bookings` - Create booking
- `GET /bookings` - List bookings
- `PUT /bookings/:id/confirm` - Confirm
- `PUT /bookings/:id/cancel` - Cancel

### Coach
- `GET /coach/profile` - Public profile
- `GET /coach/admin/profile` - Full profile (admin)
- `PUT /coach/admin/profile` - Update

### Availability
- `GET /availability` - Get schedule
- `GET /availability/slots?date=YYYY-MM-DD` - Get slots
- `POST /availability/unavailable-date` - Mark unavailable

### Events
- `GET /events/public` - Published events
- `POST /events` - Create event (admin)

---

## 🎨 Customization

### Change Colors (Tailwind)
Edit `frontend/tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: { /* your colors */ }
    }
  }
}
```

### Change Coach Information
Edit `backend/.env`:
```
COACH_NAME=Your Name
COACH_TITLE=Your Title
COACH_BIO=Your bio...
```

### Modify Session Duration
Edit `backend/.env`:
```
SESSION_DURATION_MINUTES=60
SESSION_BUFFER_MINUTES=15
```

---

## 📧 Email Setup

### Using Gmail
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to `.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

### Email Types Sent
- Booking confirmation (to client)
- Booking notification (to coach)
- Session reminder (24 hours before)
- Cancellation notice

---

## 🔄 Google Calendar Integration (Optional)

1. Create Google OAuth project: https://console.cloud.google.com
2. Generate OAuth credentials
3. Add to `.env`:
   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ```
4. In admin dashboard, click "Connect Google Calendar"

---

## 🛠️ Development Commands

### Backend
```bash
npm run start:dev      # Development with hot reload
npm run build          # Production build
npm run start:prod     # Run production build
npm run prisma:studio  # Prisma visual editor
```

### Frontend
```bash
npm run dev            # Development server
npm run build          # Production build
npm run preview        # Preview production build
npm run type-check     # TypeScript check
```

---

## 🚀 Production Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Build: `npm run build`
2. Set environment variables on hosting platform
3. Run: `npm run start:prod`

### Frontend Deployment (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder to hosting
3. Set `VITE_API_URL` to production backend URL

---

## 🔐 Security Checklist

Before production:
- [ ] Change JWT_SECRET to random string
- [ ] Change ADMIN password
- [ ] Enable HTTPS everywhere
- [ ] Set secure CORS_ORIGIN
- [ ] Enable email verification
- [ ] Set strong database password
- [ ] Enable database backups
- [ ] Add rate limiting
- [ ] Setup monitoring/logging

---

## ❓ Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (backend)
npx kill-port 3000

# Kill process on port 5173 (frontend)
npx kill-port 5173
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL format
# Test connection with: psql your_connection_string
```

### Email Not Sending
```bash
# 1. Use app-specific Gmail password
# 2. Check EMAIL_USER, EMAIL_PASSWORD
# 3. Enable less secure apps (not recommended)
# 4. Check server logs for errors
```

---

## 📞 Support

For detailed documentation, see [README.md](./README.md)

For API documentation, see [backend/README.md](./backend/README.md)

---

## 📊 Tech Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React 18 + Vite | Latest |
| Frontend Styling | Tailwind CSS 3 | Latest |
| Backend | NestJS 10 | Latest |
| Database | PostgreSQL 13+ | 13+ |
| ORM | Prisma 5 | Latest |
| Auth | JWT + Passport | Latest |
| Calendar | Google Calendar API | v3 |
| Email | Nodemailer (Gmail) | Latest |

---

**Last Updated**: January 2024
**Status**: Production Ready ✅
