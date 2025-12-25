export interface Movie {
  id: string;
  title: string;
  poster: string;
  description: string;
  duration: string;
  genre: string;
  language: string;
}

export interface Show {
  id: string;
  movieId: string;
  date: string;
  time: string;
  category: 'boys' | 'girls' | 'all';
  bookedSeats: number;
  totalSeats: number;
}

export interface SeatItem {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'booked';
  bookedBy?: string;
}

export interface SeatRow {
  name: string;
  seats: SeatItem[];
}

export interface Booking {
  id: string;
  userId: string;
  showId: string;
  seats: string[];
  status: 'pending' | 'confirmed' | 'cancelled';
  amount: number;
  createdAt: Date;
  expiresAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
