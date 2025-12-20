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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Movie not found</p>
          <Button asChild variant="outline">
            <Link to="/student/movies">Back to Movies</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Button variant="ghost" size="icon" asChild className="hover:bg-muted">
            <Link to="/student/movies">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3 ml-2">
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-border">
              <img src={srcLogo} alt="SRC Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-semibold text-foreground line-clamp-1">{movie.title}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Movie Poster */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Card className="overflow-hidden border-0 shadow-xl">
              <div className="aspect-[2/3] relative">
                <img 
                  src={movie.poster} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          </motion.div>

          {/* Details & Shows */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Movie Title */}
            <div>
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">{movie.genre}</Badge>
              <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-5 tracking-tight">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-5 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>{movie.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-accent" />
                  <span>{movie.language}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-accent" />
                  <span>{movie.genre}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <h3 className="font-display font-semibold text-lg text-foreground mb-3">About the Movie</h3>
                <p className="text-muted-foreground leading-relaxed">{movie.description}</p>
              </CardContent>
            </Card>

            {/* Warning */}
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Seat Responsibility Notice</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You are responsible for the seat you book. Any damage to your allocated seat during the screening will be traced back to you and appropriate action will be taken.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Available Shows */}
            <div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-5">
                Available Shows
              </h3>
              
              {movieShows.length > 0 ? (
                <div className="space-y-3">
                  {movieShows.map((show, index) => (
                    <motion.div
                      key={show.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card 
                        className="border-border hover:border-accent/40 hover:shadow-md transition-all duration-200 cursor-pointer group"
                        onClick={() => navigate(`/student/seat-selection/${show.id}`)}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/15 transition-colors">
                                <Calendar className="w-6 h-6 text-accent" />
                              </div>
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <span className="font-semibold text-foreground">
                                    {new Date(show.date).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
                                  </span>
                                  <Badge 
                                    variant="outline" 
                                    className={`capitalize ${
                                      show.category === 'boys' 
                                        ? 'border-accent/40 text-accent' 
                                        : show.category === 'girls' 
                                          ? 'border-pink-400 text-pink-500' 
                                          : ''
                                    }`}
                                  >
                                    {show.category}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {show.time}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5" />
                                    <span className="text-success font-medium">{show.totalSeats - show.bookedSeats}</span> seats available
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button className="rounded-full" size="sm">
                              Select Seat
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="border-border">
                  <CardContent className="p-10 text-center">
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
