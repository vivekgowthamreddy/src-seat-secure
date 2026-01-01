import 'reflect-metadata';
import { config } from 'dotenv';
config();
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

async function run() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost/seatsecure';
    console.log('Connecting to', uri);
    await mongoose.connect(uri);

    // Define schemas
    const movieSchema = new mongoose.Schema({ title: String, posterUrl: String, description: String, duration: String, genre: String, language: String }, { timestamps: true });
    const showSchema = new mongoose.Schema({ movieId: mongoose.Types.ObjectId, startTime: Date, price: Number, theaterName: String, category: String, bookedSeats: Number, totalSeats: Number });
    const seatSchema = new mongoose.Schema({ showId: mongoose.Types.ObjectId, row: String, number: Number, status: String, bookedBy: String });
    const userSchema = new mongoose.Schema({ email: String, passwordHash: String, role: String, name: String, createdAt: Date });

    const Movie = mongoose.model('Movie', movieSchema);
    const Show = mongoose.model('Show', showSchema);
    const Seat = mongoose.model('Seat', seatSchema);
    const User = mongoose.model('User', userSchema);

    // Clear collections
    console.log('Clearing database...');
    await Movie.deleteMany({});
    await Show.deleteMany({});
    await Seat.deleteMany({});
    await User.deleteMany({});

    // Create Admin and Student User
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
        }
    ];

    await User.insertMany(users);
    console.log('Database cleaned and initialized with:');
    console.log('Admin: admin@college.edu / Admin@123');
    console.log('Student: student@college.edu / Student@123');

    await mongoose.disconnect();
    process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
