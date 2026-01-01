import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import srcLogo from "@/assets/src-logo.jpg";
import { apiClient } from "@/lib/apiClient";

import { Movie, Show } from "@/lib/types";

type GenderFilter = 'all' | 'boys' | 'girls';

const MovieListing = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [moviesData, showsData] = await Promise.all([
          apiClient.getMovies(),
          apiClient.getShows(),
        ]);
        setMovies(moviesData);
        setShows(showsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter shows based on gender (Removed filter, so just all shows)
  const filteredShows = shows;

  // Get unique movies that have matching shows
  const movieIdsWithShows = new Set(filteredShows.map(s => {
    return typeof s.movieId === 'object' ? (s.movieId as Movie).id : s.movieId;
  }));
  const filteredMovies = movies.filter(m => movieIdsWithShows.has(m.id));

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading movies...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="hover:bg-muted">
              <Link to="/student/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-border">
                <img src={srcLogo} alt="SRC Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-semibold text-xl text-foreground">Movies</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2">
            Available Movies
          </h1>
          <p className="text-muted-foreground">
            Select a movie to book your seat for the show
          </p>
        </motion.div>

        {/* Movie Grid - Medium/Small Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMovies.map((movie, index) => {
            const movieShows = filteredShows.filter(s => {
              const sMovieId = typeof s.movieId === 'object' ? (s.movieId as Movie).id : s.movieId;
              return sMovieId === movie.id;
            });
            const nextShow = movieShows[0];

            return (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <Link to={`/student/movie/${movie.id}`}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer border-0 bg-card h-full">
                    <div className="aspect-[2/3] relative overflow-hidden">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent opacity-70 group-hover:opacity-80 transition-opacity" />

                      {/* Category Badge */}
                      {nextShow && (
                        <Badge
                          className={`absolute top-2 right-2 capitalize text-xs ${nextShow.category === 'boys'
                            ? 'bg-accent text-accent-foreground'
                            : nextShow.category === 'girls'
                              ? 'bg-pink-500 text-white'
                              : 'bg-muted text-foreground'
                            }`}
                        >
                          {nextShow.category}
                        </Badge>
                      )}

                      {/* Movie Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="font-display font-semibold text-white text-sm md:text-base line-clamp-2 leading-tight">
                          {movie.title}
                        </h3>
                        <div className="flex items-center gap-2 text-white/70 text-xs mt-1.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {movie.duration}
                          </span>
                          <span className="text-white/40">•</span>
                          <span>{movie.language}</span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-3">
                      {nextShow ? (
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(nextShow.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-1 text-success font-medium">
                            <Users className="w-3 h-3" />
                            <span>{nextShow.totalSeats - nextShow.bookedSeats}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">No shows scheduled</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filteredMovies.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground">No movies available.</p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default MovieListing;