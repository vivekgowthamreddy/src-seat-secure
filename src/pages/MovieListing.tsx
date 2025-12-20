import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Users, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import srcLogo from "@/assets/src-logo.jpg";
import { movies, shows, getMovieById } from "@/data/mockData";

const MovieListing = () => {
  const allShows = shows.map(show => ({
    ...show,
    movie: getMovieById(show.movieId)
  }));

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/student/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-border">
                <img src={srcLogo} alt="SRC Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-semibold text-foreground">Movies</span>
            </div>
          </div>
          
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Available Movies
          </h1>
          <p className="text-muted-foreground">
            Select a movie to book your seat for the show
          </p>
        </motion.div>

        {/* Movie Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {movies.map((movie, index) => {
            const movieShows = shows.filter(s => s.movieId === movie.id);
            const nextShow = movieShows[0];
            
            return (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/student/movie/${movie.id}`}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all group cursor-pointer border-0 bg-card">
                    <div className="aspect-[2/3] relative overflow-hidden">
                      <img 
                        src={movie.poster} 
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent opacity-80" />
                      
                      {/* Category Badge */}
                      {nextShow && (
                        <Badge 
                          className="absolute top-3 right-3 capitalize"
                          variant={nextShow.category === 'boys' ? 'default' : nextShow.category === 'girls' ? 'secondary' : 'outline'}
                        >
                          {nextShow.category}
                        </Badge>
                      )}
                      
                      {/* Movie Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-display font-bold text-primary-foreground text-base md:text-lg line-clamp-2 mb-2">
                          {movie.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-primary-foreground/80 text-xs">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {movie.duration}
                          </span>
                          <span>•</span>
                          <span>{movie.language}</span>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-3 md:p-4">
                      {nextShow ? (
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(nextShow.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-1 text-foreground font-medium">
                            <Users className="w-3.5 h-3.5 text-seat-available" />
                            <span>{nextShow.totalSeats - nextShow.bookedSeats}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No shows scheduled</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default MovieListing;
