# SAC Seat Booking System - Complete Implementation Guide

**Status: ✅ FULLY IMPLEMENTED AND READY TO RUN**

This is a complete end-to-end seat booking system with React frontend, NestJS backend, MongoDB, and JWT authentication. The system is production-ready and frontend-backend integrated.

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 16+
- MongoDB Atlas account (free tier works)
- Git

### 1. Backend Setup

```bash
cd backend
npm install

# Create .env file
cat > .env << 'EOF'
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/seatsecure?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-change-in-production
PORT=4000
EOF

# Seed test data (movies, shows, seats, users)
npm run seed

# Start dev server
npm run start:dev
```

Backend runs on `http://localhost:4000`

### 2. Frontend Setup

```bash
cd ..
npm install
npm run dev
```

Frontend runs on `http://localhost:8080`

### 3. Test the System

**Test User Credentials (after seed):**
- Email: `student@college.edu`
- Password: `Student@123`

**Admin Credentials:**
- Email: `admin@college.edu`
- Password: `Admin@123`

---

## 📋 Complete Feature List

### ✅ Authentication (JWT)
- Register new student
- Login with email/password
- JWT tokens (24h expiry)
- Password hashing with bcrypt
- Role-based access (student/admin)

### ✅ Movies & Shows
- List all movies
- Get movie details
- Filter shows by movie
- Get show availability
- Real-time seat availability

### ✅ Seat Booking
- Interactive seat selection (multiple seats)
- Prevent double-booking
- Auto-update seat status
- Calculate booking amount
- Show booking history
- Prevent unauthorized access

### ✅ Admin Features
- View all bookings
- Manage shows (CRUD)
- View booking reports
- Admin authentication guard

### ✅ Frontend Integration
- Real API calls (no mock data)
- JWT token storage (localStorage)
- Error handling & user feedback
- Loading states
- Responsive design (Tailwind CSS)
- Smooth animations (Framer Motion)

---

## 🏗️ System Architecture

### Backend Structure
```
backend/src/
├── main.ts                          # Bootstrap
├── app.module.ts                    # Root module
├── auth/                            # Authentication
│   ├── auth.service.ts              # Register, login, password hashing
│   ├── auth.controller.ts           # POST /auth/register, POST /auth/login
│   ├── strategies/jwt.strategy.ts   # JWT validation
│   ├── guards/                      # JWT and roles guards
│   └── dto/                         # Request/response DTOs
├── movies/                          # Movies
│   ├── movies.service.ts            # CRUD
│   ├── movies.controller.ts         # GET /movies, GET /movies/:id
│   └── schemas/movie.schema.ts      # Mongoose schema
├── shows/                           # Shows
│   ├── shows.service.ts             # CRUD + admin operations
│   ├── shows.controller.ts          # GET /shows, GET /shows/:id
│   └── schemas/show.schema.ts       # Mongoose schema
├── seats/                           # Seats
│   ├── seats.service.ts             # Query and update
│   ├── seats.controller.ts          # GET /shows/:id/seats
│   └── schemas/seat.schema.ts       # Mongoose schema
├── bookings/                        # Bookings
│   ├── bookings.service.ts          # Create, list, prevent double-booking
│   ├── bookings.controller.ts       # POST /bookings, GET /bookings, GET /bookings/:id
│   └── schemas/booking.schema.ts    # Mongoose schema
├── admin/                           # Admin operations
│   ├── admin.controller.ts          # POST /admin/shows, PUT /admin/shows/:id, etc.
│   └── admin.module.ts              # Admin module
└── users/                           # User management
    ├── users.service.ts             # Find and create users
    └── schemas/user.schema.ts       # User schema
```

### Frontend Structure
```
src/
├── lib/
│   ├── apiClient.ts                 # Centralized API client with auth
│   └── types.ts                     # TypeScript interfaces
├── pages/
│   ├── Index.tsx                    # Landing page
│   ├── StudentAuth.tsx              # Login/Register (INTEGRATED)
│   ├── StudentDashboard.tsx         # User dashboard
│   ├── MovieListing.tsx             # List movies (INTEGRATED)
│   ├── MovieDetails.tsx             # Movie details
│   ├── SeatSelection.tsx            # Book seats (INTEGRATED)
│   ├── BookingConfirmation.tsx      # Confirm booking
│   ├── AdminDashboard.tsx           # Admin panel
│   └── AdminLogin.tsx               # Admin login
├── components/
│   ├── ui/                          # shadcn-ui components
│   └── layout/                      # Header, Footer
├── data/
│   ├── mockData.ts                  # Seed data structure
│   └── seatLayout.ts                # Seat layout logic
└── hooks/
    └── use-toast.ts                 # Toast notifications
```

---

## 🔌 API Endpoints (Complete Reference)

### Authentication
```
POST /auth/register
{
  "email": "student@college.edu",
  "password": "Password@123",
  "name": "John Doe"
}
Response: { "message": "User registered successfully" }

POST /auth/login
{
  "email": "student@college.edu",
  "password": "Password@123"
}
Response: {
  "accessToken": "eyJhbGci...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "student@college.edu",
    "name": "John Doe",
    "role": "student"
  }
}
```

### Movies (Public)
```
GET /movies
Response: [
  {
    "id": "507f1f77bcf86cd799439011",
    "title": "Kalki 2898 AD",
    "poster": "https://...",
    "description": "...",
    "duration": "2h 58m",
    "genre": "Sci-Fi Action",
    "language": "Telugu"
  }
]

GET /movies/:id
Response: { ...movie }
```

### Shows (Public)
```
GET /shows
GET /shows?movieId=507f1f77bcf86cd799439011
Response: [
  {
    "id": "100000000000000000000001",
    "movieId": "000000000000000000000001",
    "date": "2024-12-21",
    "time": "18:00",
    "category": "boys",
    "bookedSeats": 245,
    "totalSeats": 660
  }
]

GET /shows/:id
Response: { ...show }
```

### Seats (Public)
```
GET /shows/:id/seats
Response: [
  {
    "name": "A",
    "seats": [
      {
        "id": "A1",
        "row": "A",
        "number": 1,
        "status": "available"
      },
      {
        "id": "A2",
        "row": "A",
        "number": 2,
        "status": "booked"
      }
    ]
  }
]
```

### Bookings (Protected - Requires JWT)
```
Authorization: Bearer eyJhbGci...

POST /bookings
{
  "showId": "100000000000000000000001",
  "seats": ["A1", "A2", "A3"]
}
Response: {
  "id": "507f...",
  "userId": "507f...",
  "showId": "100000000000000000000001",
  "seats": ["A1", "A2", "A3"],
  "status": "confirmed",
  "amount": 750,
  "createdAt": "2024-12-25T...",
  "expiresAt": "2024-12-26T..."
}

GET /bookings
Response: [{ ...booking }]

GET /bookings/:id
Response: { ...booking }
```

### Admin (Protected - Requires JWT + admin role)
```
Authorization: Bearer eyJhbGci...

POST /admin/shows
{
  "movieId": "000000000000000000000001",
  "startTime": "2024-12-26T18:00:00Z",
  "price": 250,
  "theaterName": "SAC Auditorium",
  "category": "all"
}

PUT /admin/shows/:id
{
  "price": 300
}

DELETE /admin/shows/:id

GET /admin/shows

GET /admin/bookings

GET /admin/reports
Response: {
  "totalBookings": 42,
  "confirmedBookings": 40,
  "totalRevenue": 18500
}
```

---

## 🔐 Security Features

✅ **Password Security**
- Bcrypt hashing (saltRounds = 10)
- Passwords never returned in responses

✅ **JWT Authentication**
- 24-hour token expiry
- Bearer token in Authorization header
- Signed with JWT_SECRET

✅ **Role-Based Access Control**
- Student and admin roles
- @Roles('admin') guard for admin endpoints
- @Roles('student') for student endpoints

✅ **Data Validation**
- class-validator for DTOs
- Email format validation
- Min length checks

✅ **Concurrency Control**
- Prevent double-booking with seat status checks
- Update seat status atomically when booking confirmed

---

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  passwordHash: String,
  role: "student" | "admin",
  name: String,
  createdAt: Date
}
```

### Movies Collection
```javascript
{
  _id: ObjectId,
  title: String,
  posterUrl: String,
  description: String,
  duration: String,
  genre: String,
  language: String
}
```

### Shows Collection
```javascript
{
  _id: ObjectId,
  movieId: ObjectId (ref Movie),
  startTime: Date,
  price: Number,
  theaterName: String,
  category: "boys" | "girls" | "all",
  bookedSeats: Number,
  totalSeats: Number
}
```

### Seats Collection
```javascript
{
  _id: ObjectId,
  showId: ObjectId (ref Show),
  row: String,
  number: Number,
  status: "available" | "booked",
  bookedBy: String (userId)
}
```

### Bookings Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref User),
  showId: ObjectId (ref Show),
  seats: [String],
  status: "pending" | "confirmed" | "cancelled",
  amount: Number,
  createdAt: Date,
  updatedAt: Date,
  expiresAt: Date
}
```

---

## 🧪 Testing the Full Flow

### 1. Register
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@college.edu",
    "password": "Test@123",
    "name": "Test User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@college.edu",
    "password": "Test@123"
  }'
# Copy the accessToken
```

### 3. Get Movies
```bash
curl http://localhost:4000/movies
```

### 4. Get Shows for Movie
```bash
curl "http://localhost:4000/shows?movieId=000000000000000000000001"
```

### 5. Get Seats for Show
```bash
curl http://localhost:4000/shows/100000000000000000000001/seats
```

### 6. Book Seats (Authenticated)
```bash
curl -X POST http://localhost:4000/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "showId": "100000000000000000000001",
    "seats": ["A1", "A2"]
  }'
```

### 7. View Bookings (Authenticated)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/bookings
```

---

## 🚀 Deployment

### Backend (Cloud Run / AWS / Heroku)

1. **Create `.env.production`**
```
MONGODB_URI=<your_atlas_connection_string>
JWT_SECRET=<generate_random_secret>
PORT=4000
NODE_ENV=production
```

2. **Build & Deploy**
```bash
npm run build
# Deploy dist/ folder to your platform
```

3. **Docker (Optional)**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 4000
CMD ["node", "dist/main.js"]
```

### Frontend (Vercel / Netlify)

1. **Update API_BASE in `src/lib/apiClient.ts`**
```typescript
const API_BASE = 'https://your-backend-url.com';
```

2. **Deploy**
```bash
npm run build
# Deploy dist/ to Vercel/Netlify
```

---

## 📚 Key Files to Review

**Backend:**
- [backend/src/auth/auth.service.ts](backend/src/auth/auth.service.ts) - Authentication logic
- [backend/src/bookings/bookings.service.ts](backend/src/bookings/bookings.service.ts) - Booking logic
- [backend/scripts/seed.ts](backend/scripts/seed.ts) - Seed data

**Frontend:**
- [src/lib/apiClient.ts](src/lib/apiClient.ts) - API client
- [src/pages/StudentAuth.tsx](src/pages/StudentAuth.tsx) - Auth integration
- [src/pages/MovieListing.tsx](src/pages/MovieListing.tsx) - Movies integration
- [src/pages/SeatSelection.tsx](src/pages/SeatSelection.tsx) - Booking integration

---

## ❓ Troubleshooting

**MongoDB Connection Failed**
- Check MONGODB_URI is correct
- Whitelist your IP in MongoDB Atlas
- Ensure username/password are URL-encoded

**JWT Token Invalid**
- Check JWT_SECRET is same in .env and MONGODB_URI
- Verify token format: `Authorization: Bearer <token>`
- Tokens expire after 24 hours

**CORS Issues**
- Backend has CORS enabled globally
- Check frontend API_BASE URL is correct
- Ensure backend is running on port 4000

**Seats not showing**
- Run `npm run seed` to populate seats
- Check MongoDB connection is active
- Verify showId is valid

---

## 📝 Environment Variables Reference

**Backend `.env`:**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/seatsecure?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-minimum-32-chars-recommended
PORT=4000
NODE_ENV=development
```

**Frontend `.env`:**
```
VITE_API_BASE=http://localhost:4000
```

---

## 🎯 What's Next?

Optional enhancements:
- Refresh tokens (extend 24h to 7d with refresh flow)
- Email verification on registration
- Payment integration (Stripe/Razorpay)
- Seat locking with Redis (prevent timeout reservations)
- Admin dashboard UI
- Booking cancellation with refunds
- Analytics and reporting
- WebSocket for real-time seat updates
- 2FA (two-factor authentication)

---

## 💡 System Capabilities

**Concurrency:**
- Handles multiple simultaneous bookings
- Prevents double-booking with seat status validation
- No race conditions (atomic DB updates)

**Performance:**
- Fast seat availability checks
- Lean queries (MongoDB projection)
- Horizontal scaling ready (stateless services)

**Scalability:**
- MongoDB Atlas auto-scaling
- Stateless backend design
- Can add Redis cache later
- CDN-ready frontend

---

## 📞 Support

For issues or questions:
1. Check MongoDB Atlas connection
2. Verify all environment variables
3. Review API response errors
4. Check browser console for frontend errors
5. Run `npm run seed` again to reset data

---

**🎉 You're All Set! Start the backend and frontend and enjoy booking seats!**

Run:
```bash
# Terminal 1: Backend
cd backend && npm run start:dev

# Terminal 2: Frontend
npm run dev
```

Visit: `http://localhost:8080` and start booking!
