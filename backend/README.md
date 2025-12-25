# Backend (NestJS) with JWT Auth

NestJS backend with MongoDB (Mongoose), JWT auth, role-based access control (RBAC), and read-only APIs for movies, shows, seats.

## Setup

```bash
cd backend
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and update:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/seatsecure?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=4000
```

## Scripts

- `npm run start:dev` - Start dev server with ts-node-dev
- `npm run seed` - Populate DB with test data (movies, shows, seats, users)
- `npm run build` - Build for production

## Seed Users

After running `npm run seed`:

**Admin:**
- Email: admin@college.edu
- Password: Admin@123
- Role: admin

**Student:**
- Email: student@college.edu
- Password: Student@123
- Role: student

## API Endpoints

### Public (No Auth Required)
- `GET /movies` - List all movies
- `GET /movies/:id` - Get movie by ID
- `GET /shows?movieId=<id>` - List shows (optional movieId filter)
- `GET /shows/:id` - Get show by ID
- `GET /shows/:id/seats` - Get seat layout for show

### Auth
- `POST /auth/register` - Register new student
- `POST /auth/login` - Login (returns JWT token)

### Protected (Auth Required)
- Booking endpoints (to be implemented)

### Admin-Only
- Admin management endpoints (to be implemented)

## Example Requests

### Register
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newstudent@college.edu",
    "password": "Password@123",
    "name": "New Student"
  }'
```

Response:
```json
{
  "message": "User registered successfully"
}
```

### Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@college.edu",
    "password": "Student@123"
  }'
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "student@college.edu",
    "name": "Student User",
    "role": "student"
  }
}
```

### Authenticated Request (with Bearer token)
```bash
curl -X GET http://localhost:4000/bookings \
  -H "Authorization: Bearer <accessToken>"
```

## Architecture

```
src/
├── main.ts                    # App bootstrap
├── app.module.ts              # Root module
├── auth/
│   ├── auth.module.ts
│   ├── auth.service.ts        # Register, login logic
│   ├── auth.controller.ts     # Auth endpoints
│   ├── dto/
│   │   ├── register.dto.ts
│   │   └── login.dto.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts    # Passport JWT strategy
│   ├── guards/
│   │   ├── jwt-auth.guard.ts  # @UseGuards(JwtAuthGuard)
│   │   └── roles.guard.ts     # @UseGuards(RolesGuard)
│   └── decorators/
│       ├── roles.decorator.ts # @Roles('admin', 'student')
│       └── current-user.decorator.ts # @CurrentUser()
├── movies/
│   ├── movies.module.ts
│   ├── movies.service.ts
│   ├── movies.controller.ts   # GET /movies, GET /movies/:id
│   ├── schemas/movie.schema.ts
│   └── dto/movie.dto.ts
├── shows/
│   ├── shows.module.ts
│   ├── shows.service.ts
│   ├── shows.controller.ts    # GET /shows, GET /shows/:id
│   ├── schemas/show.schema.ts
│   └── dto/show.dto.ts
├── seats/
│   ├── seats.module.ts
│   ├── seats.service.ts
│   ├── seats.controller.ts    # GET /shows/:id/seats
│   ├── schemas/seat.schema.ts
│   └── dto/seat-row.dto.ts
├── users/
│   ├── users.module.ts
│   ├── users.service.ts
│   ├── users.controller.ts
│   └── schemas/user.schema.ts
└── bookings/
    └── bookings.module.ts     # Placeholder for future bookings logic
```

## Features Implemented

✅ JWT authentication (register, login)
✅ Password hashing with bcrypt
✅ Role-based access control (RBAC)
✅ Public read-only APIs (movies, shows, seats)
✅ Mongoose schema validation
✅ Class-validator DTOs
✅ Guards and decorators
✅ Seed script with test users and data
✅ CORS enabled
✅ Global validation pipe

## Future Enhancements

- Refresh tokens
- Email verification
- Password reset
- Booking endpoints with transaction safety
- Redis-based seat locking
- Admin dashboard APIs
- Payment integration
- Audit logging

