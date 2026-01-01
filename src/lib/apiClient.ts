// API client for backend communication
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const apiClient = {
  // Auth
  register: async (email: string, password: string, name: string, gender: string) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, gender }),
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

  googleLogin: async (token: string, gender?: string) => {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, gender }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  verify: async (email: string, otp: string) => {
    const res = await fetch(`${API_BASE}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
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

  // Admin - Movies
  createMovie: async (token: string, movie: any) => {
    const res = await fetch(`${API_BASE}/admin/movies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(movie),
    });
    if (!res.ok) throw new Error('Failed to create movie');
    return res.json();
  },

  updateMovie: async (token: string, id: string, movie: any) => {
    const res = await fetch(`${API_BASE}/admin/movies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(movie),
    });
    if (!res.ok) throw new Error('Failed to update movie');
    return res.json();
  },

  deleteMovie: async (token: string, id: string) => {
    const res = await fetch(`${API_BASE}/admin/movies/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete movie');
    return res.json();
  },

  // Admin - Shows
  createShow: async (token: string, show: any) => {
    const res = await fetch(`${API_BASE}/admin/shows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(show),
    });
    if (!res.ok) throw new Error('Failed to create show');
    return res.json();
  },

  deleteShow: async (token: string, id: string) => {
    const res = await fetch(`${API_BASE}/admin/shows/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete show');
    return res.json();
  },

  updateSeatStatus: async (token: string, showId: string, label: string, status: string) => {
    const res = await fetch(`${API_BASE}/admin/shows/${showId}/seats/${label}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update seat status');
    return res.json();
  },

  getGlobalSeats: async (token: string) => {
    const res = await fetch(`${API_BASE}/admin/seats/global`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch global seats');
    return res.json();
  },

  toggleGlobalSeatDamage: async (token: string, label: string, isDamaged: boolean) => {
    const res = await fetch(`${API_BASE}/admin/seats/global/${label}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isDamaged }),
    });
    if (!res.ok) throw new Error('Failed to update global seat status');
    return res.json();
  },

  verifyReport: async (token: string, showId: string) => {
    const res = await fetch(`${API_BASE}/admin/shows/${showId}/verify-report`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to verify report');
    return res.json();
  },

  downloadReport: async (token: string, showId: string) => {
    const res = await fetch(`${API_BASE}/admin/shows/${showId}/download-report`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to download report');
    return res.blob();
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
