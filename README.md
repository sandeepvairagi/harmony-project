# Harmony Bookings

A production-ready MERN stack yoga instructor booking platform. Discover instructors, check real-time availability, book personalized sessions, and manage your wellness journey through a premium, responsive interface.

![Tech Stack](https://img.shields.io/badge/React-Vite-61DAFB?style=flat&logo=react)
![Node](https://img.shields.io/badge/Node-Express-339933?style=flat&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb)

## Features

- **Authentication** — JWT + bcrypt, protected routes, roles (User / Instructor / Admin)
- **Instructors** — Profiles, certifications, specializations, pricing, schedules, ratings
- **Bookings** — Real-time availability, session booking, history, cancellations
- **Premium UX** — Dark/light mode, skeleton loaders, lazy routes, pagination, error boundaries
- **AI Recommendations** — Personalized instructor matching based on preferences
- **Live Sessions** — Zoom/Google Meet links on confirmed bookings
- **Notifications** — Email (Nodemailer) + SMS (Twilio) with mock fallback in dev
- **Admin Dashboard** — Analytics, user/booking management via API

## Project Structure

```
harmony-bookings/
├── backend/
│   ├── config/          # DB, Cloudinary
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, errors
│   ├── models/          # Mongoose schemas
│   ├── routes/          # REST API routes
│   ├── services/        # Email, SMS, AI
│   ├── seed/            # Database seed script
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/  # Reusable UI
│       ├── pages/       # 11 route pages
│       ├── layouts/     # Main & Dashboard layouts
│       ├── redux/       # Redux Toolkit slices
│       ├── routes/      # React Router + guards
│       ├── services/    # Axios API client
│       ├── hooks/       # Custom hooks
│       ├── context/     # Theme provider
│       └── utils/       # Constants, formatters
└── postman/             # API collection
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone & Install

```bash
cd harmony-bookings
npm run install:all
```

### 2. Environment Variables

**Backend** — copy `backend/.env.example` to `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/harmony-bookings
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

**Frontend** — copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Optional: Cloudinary, SMTP, and Twilio keys for media upload and live notifications.

### 3. Seed Database

```bash
cd backend
npm run seed
```

### 4. Run Development Servers

```bash
# Terminal 1 - API
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000/api/health

## Demo Accounts

| Role       | Email              | Password        |
|------------|--------------------|-----------------|
| Admin      | admin@harmony.com  | admin123        |
| User       | user@harmony.com   | user123         |
| Instructor | maya@harmony.com   | instructor123   |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| GET | `/api/instructors` | List instructors (filters, pagination) |
| GET | `/api/instructors/featured` | Featured instructors |
| GET | `/api/instructors/:id` | Instructor details + reviews |
| GET | `/api/bookings/availability` | Check time slots |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/my` | User bookings |
| GET | `/api/admin/dashboard` | Admin analytics |
| POST | `/api/ai/recommend` | AI yoga recommendations |
| GET | `/api/ai/personalized` | Personalized instructors |

Import `postman/Harmony-Bookings.postman_collection.json` into Postman for full API testing.

## Database Collections

- **Users** — Auth, profiles, favorites, recently viewed
- **Instructors** — Profiles, pricing, specializations
- **Schedules** — Availability slots per date
- **Bookings** — Session reservations
- **Reviews** — Ratings and comments
- **Notifications** — In-app alerts
- **Payments** — Transaction records

## Pages

1. Landing Page — Hero, search, categories, testimonials, FAQ
2. Explore Instructors — Filters, pagination
3. Instructor Details — Profile, reviews, book CTA
4. Booking Page — Date/time selection, confirmation
5. Login / Signup
6. Dashboard — Stats, recommendations, notifications
7. User Profile — Edit preferences
8. My Sessions — Booking history, live links
9. Admin Dashboard — Analytics
10. 404 Not Found

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, Tailwind CSS, Redux Toolkit, React Router, Axios |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB |
| Auth | JWT, bcrypt |
| Storage | Cloudinary (optional) |
| Notifications | Nodemailer, Twilio |

## Production Build

```bash
cd frontend && npm run build
cd backend && NODE_ENV=production npm start
```

Serve `frontend/dist` via CDN or static hosting; point `VITE_API_URL` to your production API.

## License

MIT
