// API client for backend communication
const API_BASE = 'http://localhost:4000';

export const apiClient = {
  // Auth
  register: async (email: string, password: string, name: string) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Movies
  getMovies: async () => {
    const res = await fetch(`${API_BASE}/movies`);
    if (!res.ok) throw new Error('Failed to fetch movies');
    return res.json();
  },

  getMovie: async (id: string) => {
    const res = await fetch(`${API_BASE}/movies/${id}`);
    if (!res.ok) throw new Error('Failed to fetch movie');
    return res.json();
  },

  // Shows
  getShows: async (movieId?: string) => {
    const url = movieId ? `${API_BASE}/shows?movieId=${movieId}` : `${API_BASE}/shows`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch shows');
    return res.json();
  },

  getShow: async (id: string) => {
    const res = await fetch(`${API_BASE}/shows/${id}`);
    if (!res.ok) throw new Error('Failed to fetch show');
    return res.json();
  },

  // Seats
  getSeats: async (showId: string) => {
    const res = await fetch(`${API_BASE}/shows/${showId}/seats`);
    if (!res.ok) throw new Error('Failed to fetch seats');
    return res.json();
  },

  // Bookings
  createBooking: async (token: string, showId: string, seats: string[]) => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ showId, seats }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getBookings: async (token: string) => {
    const res = await fetch(`${API_BASE}/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  getBooking: async (token: string, id: string) => {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch booking');
    return res.json();
  },
};

// Auth helper
export const authHelper = {
  setToken: (token: string) => localStorage.setItem('token', token),
  getToken: () => localStorage.getItem('token'),
  setUser: (user: any) => localStorage.setItem('user', JSON.stringify(user)),
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  isAuthenticated: () => !!localStorage.getItem('token'),
};
