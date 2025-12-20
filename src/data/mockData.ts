// Mock data for movies and shows

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

export const movies: Movie[] = [
  {
    id: "1",
    title: "Kalki 2898 AD",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    description: "An epic science fiction action film set in a post-apocalyptic world, combining Indian mythology with futuristic elements.",
    duration: "2h 58m",
    genre: "Sci-Fi Action",
    language: "Telugu",
  },
  {
    id: "2",
    title: "Pushpa 2: The Rule",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
    description: "The continuation of Pushpa Raj's journey as he rises to become the undisputed king of the smuggling syndicate.",
    duration: "3h 20m",
    genre: "Action Drama",
    language: "Telugu",
  },
  {
    id: "3",
    title: "Devara: Part 1",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop",
    description: "A fierce man rises from coastal lands to protect his people, navigating through power, legacy, and survival.",
    duration: "2h 45m",
    genre: "Action Thriller",
    language: "Telugu",
  },
  {
    id: "4",
    title: "Salaar: Part 1 – Ceasefire",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    description: "A gang leader tries to keep a promise made to his dying friend and must choose between violence and a peaceful life.",
    duration: "2h 55m",
    genre: "Action Thriller",
    language: "Telugu",
  },
];

export const shows: Show[] = [
  {
    id: "show1",
    movieId: "1",
    date: "2024-12-21",
    time: "18:00",
    category: "boys",
    bookedSeats: 245,
    totalSeats: 660,
  },
  {
    id: "show2",
    movieId: "1",
    date: "2024-12-21",
    time: "21:00",
    category: "girls",
    bookedSeats: 189,
    totalSeats: 660,
  },
  {
    id: "show3",
    movieId: "2",
    date: "2024-12-22",
    time: "18:00",
    category: "all",
    bookedSeats: 412,
    totalSeats: 660,
  },
];

export const getMovieById = (id: string): Movie | undefined => {
  return movies.find(movie => movie.id === id);
};

export const getShowById = (id: string): Show | undefined => {
  return shows.find(show => show.id === id);
};

export const getShowsForMovie = (movieId: string): Show[] => {
  return shows.filter(show => show.movieId === movieId);
};
