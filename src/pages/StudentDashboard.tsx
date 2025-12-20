import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Film, Calendar, Clock, Users, Armchair, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import srcLogo from "@/assets/src-logo.jpg";
import { movies, shows, getMovieById } from "@/data/mockData";

const StudentDashboard = () => {
  const studentName = "Rahul Kumar";
  const studentId = "N210456";
  
  // Mock: student has already booked a seat
  const currentBooking = {
    movieTitle: "Kalki 2898 AD",
    seatNumber: "G15",
    showTime: "6:00 PM",
    showDate: "Dec 21, 2024",
    category: "Boys"
  };

  const upcomingShows = shows.slice(0, 3).map(show => ({
    ...show,
    movie: getMovieById(show.movieId)
  }));

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border">
              <img src={srcLogo} alt="SRC Logo" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-semibold text-foreground">SRC</span>
              <span className="text-muted-foreground text-sm ml-2">Student Portal</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{studentName}</p>
              <p className="text-xs text-muted-foreground">{studentId}</p>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <LogOut className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Welcome, {studentName.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            One student • One seat • One show
          </p>
        </motion.div>

        {/* Current Booking Card */}
        {currentBooking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-primary text-primary-foreground border-0 shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardHeader className="pb-2 relative">
                <div className="flex items-center gap-2 text-accent text-sm font-medium">
                  <Armchair className="w-4 h-4" />
                  Your Allocated Seat
                </div>
                <CardTitle className="text-4xl md:text-5xl font-display font-bold">
                  {currentBooking.seatNumber}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-primary-foreground/80 text-sm">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4" />
                    {currentBooking.movieTitle}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {currentBooking.showDate}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {currentBooking.showTime}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {currentBooking.category} Show
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-primary-foreground/10 rounded-xl">
                  <p className="text-sm text-primary-foreground/90">
                    <strong>Important:</strong> You are responsible for this seat. Any damage will be traced to you.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Bookings", value: "3", icon: Film },
            { label: "Upcoming Shows", value: "1", icon: Calendar },
            { label: "Seat History", value: "Clean", icon: Armchair },
            { label: "Status", value: "Active", icon: Users },
          ].map((stat, index) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-display font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Upcoming Movies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Available Movies
            </h2>
            <Button variant="ghost" asChild className="text-primary">
              <Link to="/student/movies">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingShows.map((show, index) => (
              <motion.div
                key={show.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Link to={`/student/movie/${show.movieId}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all group cursor-pointer border-border/50">
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <img 
                        src={show.movie?.poster} 
                        alt={show.movie?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-primary-foreground font-display font-semibold text-lg">
                          {show.movie?.title}
                        </p>
                        <div className="flex items-center gap-3 text-primary-foreground/80 text-sm mt-1">
                          <span>{new Date(show.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                          <span>•</span>
                          <span>{show.time}</span>
                          <span>•</span>
                          <span className="capitalize">{show.category}</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Available Seats</p>
                          <p className="font-semibold text-foreground">{show.totalSeats - show.bookedSeats} / {show.totalSeats}</p>
                        </div>
                        <Button size="sm">Book Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Rules Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="bg-muted/50 border-border/50">
            <CardContent className="p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">Rules & Guidelines</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  Only occupy your allocated seat. Seat swapping is strictly prohibited.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  Report any pre-existing damage to the SAC coordinator before the show starts.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  Maintain discipline and respect for university property at all times.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  Carry your student ID for verification at entry.
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default StudentDashboard;
