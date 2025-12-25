import 'reflect-metadata';
import { config } from 'dotenv';
config();
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost/seatsecure';
  console.log('Connecting to', uri);
  await mongoose.connect(uri);

  const db = mongoose.connection;

  // Define simple schemas inline for seed convenience
  const movieSchema = new mongoose.Schema({ title: String, posterUrl: String, description: String, duration: String, genre: String, language: String }, { timestamps: true });
  const showSchema = new mongoose.Schema({ movieId: mongoose.Types.ObjectId, startTime: Date, price: Number, theaterName: String, category: String, bookedSeats: Number, totalSeats: Number });
  const seatSchema = new mongoose.Schema({ showId: mongoose.Types.ObjectId, row: String, number: Number, status: String, bookedBy: String });
  const userSchema = new mongoose.Schema({ email: String, passwordHash: String, role: String, name: String, createdAt: Date });

  const Movie = mongoose.model('Movie', movieSchema);
  const Show = mongoose.model('Show', showSchema);
  const Seat = mongoose.model('Seat', seatSchema);
  const User = mongoose.model('User', userSchema);

  // Clear collections
  await Movie.deleteMany({});
  await Show.deleteMany({});
  await Seat.deleteMany({});
  await User.deleteMany({});

  // Seed users with hashed passwords
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const studentPassword = await bcrypt.hash('Student@123', 10);

  const users = [
    {
      email: 'admin@college.edu',
      passwordHash: adminPassword,
      role: 'admin',
      name: 'Admin User',
      createdAt: new Date(),
    },
    {
      email: 'student@college.edu',
      passwordHash: studentPassword,
      role: 'student',
      name: 'Student User',
      createdAt: new Date(),
    },
  ];

  await User.insertMany(users);
  console.log('Users created: admin@college.edu (password: Admin@123), student@college.edu (password: Student@123)');

  // Seed movies (match src/data/mockData.ts)
  const movies = [
    {
      _id: new mongoose.Types.ObjectId('000000000000000000000001'),
      title: 'Kalki 2898 AD',
      posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
      description: 'An epic science fiction action film set in a post-apocalyptic world, combining Indian mythology with futuristic elements.',
      duration: '2h 58m',
      genre: 'Sci-Fi Action',
      language: 'Telugu',
    },
    {
      _id: new mongoose.Types.ObjectId('000000000000000000000002'),
      title: 'Pushpa 2: The Rule',
      posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
      description: "The continuation of Pushpa Raj's journey as he rises to become the undisputed king of the smuggling syndicate.",
      duration: '3h 20m',
      genre: 'Action Drama',
      language: 'Telugu',
    },
    {
      _id: new mongoose.Types.ObjectId('000000000000000000000003'),
      title: 'Devara: Part 1',
      posterUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop',
      description: 'A fierce man rises from coastal lands to protect his people, navigating through power, legacy, and survival.',
      duration: '2h 45m',
      genre: 'Action Thriller',
      language: 'Telugu',
    },
    {
      _id: new mongoose.Types.ObjectId('000000000000000000000004'),
      title: 'Salaar: Part 1 – Ceasefire',
      posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
      description: 'A gang leader tries to keep a promise made to his dying friend and must choose between violence and a peaceful life.',
      duration: '2h 55m',
      genre: 'Action Thriller',
      language: 'Telugu',
    },
  ];

  await Movie.insertMany(movies);

  // Seed shows (matching src/data/mockData.ts shows)
  const shows = [
    {
      _id: new mongoose.Types.ObjectId('100000000000000000000001'),
      movieId: movies[0]._id,
      startTime: new Date('2024-12-21T18:00:00Z'),
      price: 250,
      theaterName: 'SAC Auditorium',
      category: 'boys',
      bookedSeats: 245,
      totalSeats: 660,
    },
    {
      _id: new mongoose.Types.ObjectId('100000000000000000000002'),
      movieId: movies[0]._id,
      startTime: new Date('2024-12-21T21:00:00Z'),
      price: 250,
      theaterName: 'SAC Auditorium',
      category: 'girls',
      bookedSeats: 189,
      totalSeats: 660,
    },
    {
      _id: new mongoose.Types.ObjectId('100000000000000000000003'),
      movieId: movies[1]._id,
      startTime: new Date('2024-12-22T18:00:00Z'),
      price: 200,
      theaterName: 'SAC Auditorium',
      category: 'all',
      bookedSeats: 412,
      totalSeats: 660,
    },
  ];

  await Show.insertMany(shows);

  // Generate seats matching seatLayout.ts logic
  const ROWS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R'];
  const getSeatsForRow = (row: string) => {
    if (['M','N','O','P','Q','R'].includes(row)) return 34;
    return 38;
  };

  const seatDocs: any[] = [];
  for (const show of shows) {
    for (const row of ROWS) {
      const count = getSeatsForRow(row);
      for (let i = 1; i <= count; i++) {
        seatDocs.push({ showId: show._id, row, number: i, status: 'available' });
      }
    }
  }

  await Seat.insertMany(seatDocs);

  console.log('Seed complete: users, movies, shows, seats inserted');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
