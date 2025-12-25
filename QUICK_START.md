# ⚡ Quick Reference Card

## 🎯 Start in 3 Steps

```bash
# Step 1: Backend (Terminal 1)
cd backend
npm install
npm run seed                    # Populate test data
npm run start:dev              # Runs on http://localhost:4000

# Step 2: Frontend (Terminal 2)
npm install
npm run dev                     # Runs on http://localhost:8080

# Step 3: Visit Browser
# Go to http://localhost:8080
# Login with: student@college.edu / Student@123
```

---

## 🔑 Test Credentials

| Email | Password | Role |
|-------|----------|------|
| `student@college.edu` | `Student@123` | Student |
| `admin@college.edu` | `Admin@123` | Admin |

---

## 📡 API Quick Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register new student |
| POST | `/auth/login` | ❌ | Login, get JWT token |
| GET | `/movies` | ❌ | List all movies |
| GET | `/movies/:id` | ❌ | Get movie details |
| GET | `/shows` | ❌ | List shows (filter: ?movieId=...) |
| GET | `/shows/:id` | ❌ | Get show details |
| GET | `/shows/:id/seats` | ❌ | Get seat layout |
| POST | `/bookings` | ✅ | Create booking |
| GET | `/bookings` | ✅ | Get user's bookings |
| GET | `/bookings/:id` | ✅ | Get booking details |
| GET | `/admin/bookings` | ✅ Admin | All bookings |
| GET | `/admin/reports` | ✅ Admin | Booking stats |

---

## 🗂️ File Structure

```
backend/
├── src/
│   ├── auth/              # JWT authentication
│   ├── movies/            # Movie APIs
│   ├── shows/             # Show APIs + admin
│   ├── seats/             # Seat APIs
│   ├── bookings/          # Booking logic
│   ├── admin/             # Admin endpoints
│   └── users/             # User management
├── scripts/
│   └── seed.ts            # Populate test data
├── package.json
├── .env.example
└── README.md

src/
├── lib/
│   ├── apiClient.ts       # ⭐ Centralized API calls
│   └── types.ts           # TypeScript interfaces
├── pages/
│   ├── StudentAuth.tsx    # ✅ Integrated with backend
│   ├── MovieListing.tsx   # ✅ Integrated with backend
│   └── SeatSelection.tsx  # ✅ Integrated with backend
├── components/
│   └── ui/                # shadcn-ui components
└── data/
    ├── mockData.ts        # Seed structure
    └── seatLayout.ts      # Seat layout logic
```

---

## 🔄 Complete User Flow

```
1. Visit http://localhost:8080
   ↓
2. Register or Login
   ↓
3. Browse Movies (GET /movies)
   ↓
4. Select Movie (GET /movies/:id)
   ↓
5. Choose Show (GET /shows?movieId=...)
   ↓
6. Select Seats (GET /shows/:id/seats)
   ↓
7. Book Seats (POST /bookings with JWT)
   ↓
8. Confirmation & View History (GET /bookings)
```

---

## 🛠️ Common Commands

```bash
# Backend
cd backend
npm install           # Install dependencies
npm run start:dev     # Start dev server
npm run seed          # Seed test data
npm run build         # Build for production
npm run seed          # Reset data

# Frontend
npm install           # Install dependencies
npm run dev           # Start dev server
npm run build         # Build for production
npm run lint          # Run linter
```

---

## 🔧 Environment Setup

**Backend `.env`:**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/seatsecure?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-change-this
PORT=4000
```

**Get MongoDB Atlas Connection:**
1. Create account at mongodb.com/cloud
2. Create cluster (free tier OK)
3. Add your IP to IP whitelist
4. Copy connection string
5. Replace `<password>` with your password

---

## ✅ What's Implemented

- ✅ JWT auth (register, login)
- ✅ Movies & shows APIs
- ✅ Seat selection & booking
- ✅ Prevent double-booking
- ✅ Role-based access
- ✅ Frontend integrated
- ✅ localStorage token storage
- ✅ Real API calls (no mock)
- ✅ Responsive design
- ✅ Error handling

---

## ⚠️ Common Issues & Fixes

**"MongoDB connection failed"**
- Check MONGODB_URI in .env
- Whitelist your IP on MongoDB Atlas
- Verify credentials are URL-encoded

**"JWT invalid"**
- Check Authorization header format: `Bearer <token>`
- Verify token is from login response
- Tokens expire after 24 hours

**"Seats not loading"**
- Run `npm run seed` in backend
- Check backend is running (port 4000)
- Check browser console for errors

**"API calls not working"**
- Verify both servers running
- Check CORS is enabled (it is by default)
- Check network tab in DevTools

---

## 🎬 Test a Booking

```bash
# 1. Login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@college.edu","password":"Student@123"}'

# Response: { "accessToken": "TOKEN_HERE", "user": {...} }

# 2. Get shows
curl http://localhost:4000/shows

# 3. Get seats for show ID (e.g., 100000000000000000000001)
curl http://localhost:4000/shows/100000000000000000000001/seats

# 4. Book seats
curl -X POST http://localhost:4000/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_HERE" \
  -d '{
    "showId": "100000000000000000000001",
    "seats": ["A1", "A2"]
  }'
```

---

## 📊 Database Collections

- **users** - Student & admin accounts
- **movies** - Movie catalog
- **shows** - Movie showtimes
- **seats** - Physical seats (updated on booking)
- **bookings** - User bookings

---

## 🚀 Deploy (Quick Steps)

**Backend:**
1. Push code to GitHub
2. Connect GitHub to Vercel/Render
3. Set env vars in platform settings
4. Deploy

**Frontend:**
1. Update `API_BASE` in `src/lib/apiClient.ts`
2. `npm run build`
3. Deploy `dist/` to Vercel/Netlify

---

## 💾 Database Backup

```bash
# Backup MongoDB (already in MongoDB Atlas cloud)
# No action needed - Atlas handles backups automatically
```

---

## 🎓 Key Learning Points

- **JWT Authentication** - See `backend/src/auth/`
- **Booking Logic** - See `backend/src/bookings/bookings.service.ts`
- **API Integration** - See `src/lib/apiClient.ts`
- **Frontend State** - See `src/pages/SeatSelection.tsx`
- **Database Design** - See `backend/src/*/schemas/`

---

## 📚 Documentation

- Complete guide: `COMPLETE_GUIDE.md`
- Backend README: `backend/README.md`
- Frontend README: `README.md`

---

**Ready to go! 🎉**

```
cd backend && npm run start:dev    # Terminal 1
npm run dev                         # Terminal 2
# Visit http://localhost:8080
```
