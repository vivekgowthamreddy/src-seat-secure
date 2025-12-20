import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Film, Globe, Calendar, Users, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import srcLogo from "@/assets/src-logo.jpg";
import { getMovieById, getShowsForMovie } from "@/data/mockData";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = getMovieById(id || "");
  const movieShows = getShowsForMovie(id || "");

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Movie not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/student/movies">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3 ml-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-border">
              <img src={srcLogo} alt="SRC Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-semibold text-foreground line-clamp-1">{movie.title}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Movie Poster & Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="overflow-hidden border-0 shadow-xl">
              <div className="aspect-[2/3] relative">
                <img 
                  src={movie.poster} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-60" />
              </div>
            </Card>
          </motion.div>

          {/* Details & Shows */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Movie Title */}
            <div>
              <Badge className="mb-3">{movie.genre}</Badge>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {movie.duration}
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {movie.language}
                </div>
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4" />
                  {movie.genre}
                </div>
              </div>
            </div>

            {/* Description */}
            <Card className="border-border/50">
              <CardContent className="p-6">
                <h3 className="font-display font-semibold text-foreground mb-3">About the Movie</h3>
                <p className="text-muted-foreground leading-relaxed">{movie.description}</p>
              </CardContent>
            </Card>

            {/* Warning */}
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Seat Responsibility Notice</h4>
                  <p className="text-sm text-muted-foreground">
                    You are responsible for the seat you book. Any damage to your allocated seat during the screening will be traced back to you and appropriate action will be taken.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Available Shows */}
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                Available Shows
              </h3>
              
              {movieShows.length > 0 ? (
                <div className="space-y-3">
                  {movieShows.map((show) => (
                    <Card 
                      key={show.id} 
                      className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/student/seat-selection/${show.id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">
                                  {new Date(show.date).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
                                </span>
                                <Badge variant="outline" className="capitalize">{show.category}</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {show.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3.5 h-3.5" />
                                  {show.totalSeats - show.bookedSeats} seats available
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button>
                            Select Seat
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-border/50">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No shows scheduled for this movie.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default MovieDetails;
