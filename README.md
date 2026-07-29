# 🎯 Professional Coaching Platform

A complete, production-ready web application for managing coaching services. This platform includes a modern responsive frontend, robust backend API, booking system, calendar integration, and admin dashboard.

## ✨ Features

### Public Features
- **Home Page (Overview)**: Display coach profile, expertise, and years of experience
- **Booking System**: Multi-step booking form with real-time availability
- **Calendar Integration**: Google Calendar sync for bookings
- **Events Management**: Publish and manage special coaching events
- **WhatsApp Integration**: Floating WhatsApp button for quick communication
- **Email Notifications**: Automated confirmations and reminders
- **Responsive Design**: Mobile-first design with Tailwind CSS

### Admin Features
- **Dashboard Overview**: Statistics and today's sessions
- **Bookings Management**: View, confirm, and cancel bookings
- **Availability Management**: Set weekly schedule and unavailable dates
- **Events Management**: Create and publish special events
- **Profile Settings**: Manage coach information
- **Session Analytics**: Track bookings and performance

## 🏗️ Architecture

```
coaching/
├── backend/               # NestJS Backend API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/              # Authentication & JWT
│   │   │   ├── coach/             # Coach profile management
│   │   │   ├── bookings/          # Booking/reservation system
│   │   │   ├── availability/      # Schedule management
│   │   │   ├── email/             # Email notifications
│   │   │   ├── events/            # Special events
│   │   │   ├── google-calendar/   # Google Calendar integration
│   │   │   └── prisma/            # Database service
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/              # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── WhatsAppButton.tsx
│   │   │   └── admin/
│   │   │       ├── DashboardOverview.tsx
│   │   │       ├── BookingsManagement.tsx
│   │   │       ├── AvailabilityManagement.tsx
│   │   │       ├── EventsManagement.tsx
│   │   │       └── ProfileSettings.tsx
│   │   ├── pages/
│   │   │   ├── Overview.tsx
│   │   │   ├── Booking.tsx
│   │   │   ├── Events.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   └── NotFound.tsx
│   │   ├── services/
│   │   │   └── api.ts              # API client
│   │   ├── hooks/
│   │   │   └── useAuth.ts          # Auth hooks
│   │   ├── utils/
│   │   │   ├── date.ts
│   │   │   └── auth.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── .env.example           # Environment variables template
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 13+
- npm or yarn

### Installation

#### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp ../.env.example .env
# Edit .env with your configuration

# Set up database
npx prisma generate
npx prisma db push

# Start development server
npm run start:dev
```

#### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173` and the API at `http://localhost:3000`.

## 🔧 Configuration

### Backend Environment Variables (`.env`)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/coaching_db"

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET="your-secret-key-here"
JWT_EXPIRATION="24h"

# Email (Gmail SMTP)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"

# Google Calendar
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URL="http://localhost:3000/auth/google/callback"

# Coach Information
COACH_NAME="Your Name"
COACH_TITLE="Professional Coach"
COACH_EMAIL="coach@example.com"
COACH_PHONE="+1234567890"
COACH_BIO="Your bio here..."

# Admin
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="SecurePassword123"
```

### Frontend Environment Variables (`.env`)

```env
VITE_API_URL=http://localhost:3000
VITE_WHATSAPP_NUMBER=+1234567890
VITE_WHATSAPP_MESSAGE=Hello, I would like to know more about your coaching services.
```

## 📱 API Endpoints

### Authentication
- `POST /auth/login` - Admin login
- `POST /auth/register` - Register new admin
- `GET /auth/profile` - Get admin profile
- `POST /auth/logout` - Logout

### Coach
- `GET /coach/profile` - Get public coach profile
- `GET /coach/admin/profile` - Get full coach profile (admin)
- `PUT /coach/admin/profile` - Update coach profile

### Availability
- `GET /availability` - Get weekly availability
- `GET /availability/slots?date=YYYY-MM-DD` - Get available time slots
- `PUT /availability/:dayOfWeek` - Update availability
- `POST /availability/unavailable-date` - Mark date as unavailable
- `GET /availability/unavailable-dates` - Get all unavailable dates

### Bookings
- `POST /bookings` - Create new booking
- `GET /bookings` - Get all bookings
- `GET /bookings/:id` - Get booking details
- `PUT /bookings/:id/confirm` - Confirm booking
- `PUT /bookings/:id/cancel` - Cancel booking
- `DELETE /bookings/:id` - Delete booking
- `GET /bookings/admin/stats` - Get booking statistics
- `GET /bookings/admin/today` - Get today's sessions

### Events
- `GET /events/public` - Get published events
- `GET /events` - Get all events (admin)
- `POST /events` - Create event
- `PUT /events/:id` - Update event
- `PUT /events/:id/publish` - Publish event
- `PUT /events/:id/unpublish` - Unpublish event
- `DELETE /events/:id` - Delete event

### Google Calendar
- `GET /google-calendar/auth-url` - Get Google OAuth URL
- `POST /google-calendar/callback?code=...` - Handle OAuth callback
- `GET /google-calendar/status` - Get integration status

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key models:

- **Admin**: Admin users for dashboard access
- **Coach**: Coach profile and information
- **Availability**: Weekly schedule (7 days)
- **UnavailableDate**: Specific dates coach is unavailable
- **Booking**: Client bookings/reservations
- **SpecialEvent**: Special coaching events
- **EmailLog**: Email sending history

## 🔐 Security Features

- JWT authentication with secure tokens
- Password hashing with bcrypt
- Environment variable protection
- CORS enabled
- Input validation and sanitization
- Role-based access control

## 📧 Email Integration

The platform uses Gmail SMTP for sending:
- Booking confirmations
- Appointment reminders (24 hours before)
- Cancellation notices
- Coach notifications

To enable email:
1. Enable 2FA on Gmail account
2. Generate app-specific password
3. Add credentials to `.env`

## 🔄 Google Calendar Integration

Sessions can be automatically synced with Google Calendar:
1. Configure Google OAuth credentials
2. Click "Connect Google Calendar" in admin settings
3. Grant calendar access
4. Bookings will automatically create calendar events

## 📱 WhatsApp Integration

The WhatsApp button opens WhatsApp Web with a pre-filled message. Configure:
- `COACH_WHATSAPP` in backend `.env`
- `VITE_WHATSAPP_NUMBER` in frontend `.env`

## 🛠️ Development

### Available Commands

**Backend:**
```bash
npm run start:dev      # Start development server with hot reload
npm run build          # Build for production
npm run start:prod     # Start production server
npm run lint           # Run ESLint
npm test              # Run tests
npm run prisma:migrate # Create database migration
npm run prisma:studio  # Open Prisma Studio
```

**Frontend:**
```bash
npm run dev           # Start Vite dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
npm run type-check    # Check TypeScript types
```

## 📦 Deployment

### Backend (NestJS)

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to hosting (Heroku, DigitalOcean, AWS, etc.):
   ```bash
   npm run start:prod
   ```

### Frontend (React + Vite)

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to CDN or static hosting:
   - Vercel, Netlify, AWS S3 + CloudFront
   - Static folder can be deployed to any web server

## 🐛 Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Run `npx prisma db push`

### Google Calendar Not Working
- Verify OAuth credentials
- Check redirect URL matches Google Console
- Clear browser cache and re-authenticate

### Email Not Sending
- Enable "Less secure apps" or use app-specific password
- Check `EMAIL_USER` and `EMAIL_PASSWORD`
- Verify SMTP settings

### CORS Errors
- Check `CORS_ORIGIN` in backend `.env`
- Ensure frontend URL is included
- Clear browser cache

## 📝 License

This project is provided as-is for coaching business use.

## 💬 Support

For issues or questions, please refer to the API documentation or contact support.

---

**Last Updated**: 2024
**Version**: 1.0.0
