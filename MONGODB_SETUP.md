# MongoDB Setup Instructions

Your MongoDB Atlas cluster is ready! Here's how to complete the setup:

## Step 1: Get Your MongoDB Credentials

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Log in to your account
3. Navigate to **Database Access** → Create a database user
   - Username: `seatsecure_user` (or your choice)
   - Password: (Generate a secure password)
   - Add to IP Whitelist: `0.0.0.0/0` (for development) or your IP
4. Navigate to **Clusters** → Connect → Choose "Connect your application"
5. Copy the connection string (format: `mongodb+srv://username:password@...`)

## Step 2: Update Your .env File

Edit `/backend/.env` and replace `<username>` and `<password>`:

```
MONGODB_URI=mongodb+srv://seatsecure_user:YOUR_PASSWORD@ac-ocikp8f-shard-00-02.gnnxctj.mongodb.net/seatsecure?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345
PORT=4000
```

**Example:**
```
MONGODB_URI=mongodb+srv://seatsecure_user:MySecurePass123@ac-ocikp8f-shard-00-02.gnnxctj.mongodb.net/seatsecure?retryWrites=true&w=majority
```

## Step 3: Run the Seed Script

```bash
cd backend
npm run seed
```

You should see:
```
✅ Database connected successfully
✅ Collections cleared
✅ Users seeded (2)
✅ Movies seeded (4)
✅ Shows seeded (3)
✅ Seats seeded (1,980)
```

## Step 4: Start the Servers

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
npm run dev
```

## Test Credentials

Once seeded, you can login with:

- **Student:** `student@college.edu` / `Student@123`
- **Admin:** `admin@college.edu` / `Admin@123`

## Common Issues

**"MongoParseError: mongodb+srv URI cannot have port number"**
- Remove `:27017` from the connection string
- Use format: `mongodb+srv://username:password@cluster...`

**"MongoAuthenticationError: authentication failed"**
- Check username and password are correct
- Ensure user is added to the IP whitelist
- Go to Database Access and verify credentials

**"Connection refused"**
- Ensure cluster is active in MongoDB Atlas
- Check internet connection
- Verify IP is whitelisted

## Next Steps

After seeding, visit http://localhost:8080 and:
1. Create a new student account or login with test credentials
2. Browse movies and shows
3. Select seats and complete a booking
4. Check admin endpoints at http://localhost:4000/api/admin/* (with admin token)

Happy booking! 🎬🎟️
