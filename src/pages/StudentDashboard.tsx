import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Film, Calendar, Clock, Users, Armchair, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import srcLogo from "@/assets/src-logo.jpg";
import { apiClient, authHelper } from "@/lib/apiClient";
import { useToast } from "@/hooks/use-toast";
import { User, Booking, Show, Movie } from "@/lib/types";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [upcomingShows, setUpcomingShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth
    if (!authHelper.isAuthenticated()) {
      navigate('/student/login');
      return;
    }

    const userData = authHelper.getUser();
    if (userData) {
      setUser(userData);
    } else {
      navigate('/student/login');
      return;
    }

    const loadDashboardData = async () => {
      try {
        const token = authHelper.getToken();
        if (!token) return;

        // Fetch User Bookings
        const userBookings = await apiClient.getBookings(token);
        // Sort bookings by date descending (newest first)
        userBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookings(userBookings);

        // Fetch Upcoming Shows
        const allShows = await apiClient.getShows();

        // Filter based on gender
        const userData = authHelper.getUser();
        const filteredShows = allShows.filter(show => {
          if (!userData) return true;
          if (userData.role === 'admin') return true;

          const gender = userData.gender?.toLowerCase();

          if (gender === 'male') {
            return show.category === 'boys' || show.category === 'all';
          }

          if (gender === 'female') {
            return show.category === 'girls' || show.category === 'all';
          }

          // Default for users without gender (old accounts) -> Show only 'all'
          return show.category === 'all';
        });

        // Filter out past shows? For now just take 3.
        setUpcomingShows(filteredShows.slice(0, 3));

      } catch (error) {
        console.error("Failed to load dashboard data", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please refresh.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate, toast]);

  const handleLogout = () => {
    authHelper.logout();
    navigate("/");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  // Get the most recent booking for the "Current Booking" card
  const currentBooking = bookings.length > 0 ? bookings[0] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-border group-hover:ring-accent/50 transition-all">
              <img src={srcLogo} alt="SRC Logo" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-semibold text-foreground">SRC</span>
              <span className="text-muted-foreground text-sm ml-2">Student Portal</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-muted">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2 tracking-tight">
            Welcome, {user?.name.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground text-lg">
            One student • One seat • One show
          </p>
        </motion.div>

        {/* Current Booking Card */}
        {currentBooking ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8"
          >
            <Card className="bg-primary text-white border-0 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardHeader className="pb-2 relative">
                <div className="flex items-center gap-2 text-accent text-sm font-medium">
                  <Armchair className="w-4 h-4" />
                  Your Allocated Seat
                </div>
                <CardTitle className="text-6xl md:text-7xl font-display font-semibold tracking-tight">
                  {currentBooking.seats.join(', ')}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative pb-6">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/70 text-sm">
                  {/* Depending on if showId is populated or just ID. Assuming populated for now or we need to handle it */}
                  {typeof currentBooking.showId === 'object' && (
                    <>
                      <div className="flex items-center gap-2">
                        <Film className="w-4 h-4" />
                        {typeof (currentBooking.showId as Show).movieId === 'object'
                          ? ((currentBooking.showId as Show).movieId as Movie).title
                          : "Movie"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date((currentBooking.showId as Show).date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {(currentBooking.showId as Show).time}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span className="capitalize">{(currentBooking.showId as Show).category} Show</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <p className="text-sm text-white/90">
                    <strong>Important:</strong> You are responsible for this seat. Any damage will be traced to you.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8"
          >
            <Card className="bg-card text-foreground border-dashed border-2 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Armchair className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-xl font-semibold mb-2">No Active Bookings</p>
                <p className="text-muted-foreground mb-4">You haven't booked any seats yet.</p>
                <Button asChild>
                  <Link to="/student/movies">Book a Seat Now</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {[
            { label: "Total Bookings", value: bookings.length.toString(), icon: Film },
            { label: "Upcoming Shows", value: upcomingShows.length.toString(), icon: Calendar },
            { label: "Seat History", value: "Clean", icon: Armchair },
            { label: "Status", value: "Active", icon: Users },
          ].map((stat, index) => (
            <Card key={stat.label} className="border-border bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-semibold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Upcoming Movies */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Available Movies
            </h2>
            <Button variant="ghost" asChild className="text-accent hover:text-accent">
              <Link to="/student/movies">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcomingShows.map((show, index) => {
              // Check if user has booked this show
              const userBooking = bookings.find(b => {
                const showId = typeof b.showId === 'object' ? (b.showId as Show).id : b.showId;
                return showId === show.id;
              });

              return (
                <motion.div
                  key={show.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                >
                  <div className="h-full relative group">
                    {/* We can't wrap the whole card in Link if we want different destinations.
                     So we'll use a div wrapper and handle click or separate links.
                     Actually, standard simple approach: Conditional Link destination.
                  */}
                    <Link to={userBooking
                      ? `/student/booking-confirmation/${show.id}/${userBooking.seats.join(',')}`
                      : `/student/movie/${typeof show.movieId === 'object' ? (show.movieId as Movie).id : show.movieId}`
                    }>
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-border h-full">
                        <div className="aspect-[16/10] relative overflow-hidden">
                          <img
                            src={typeof show.movieId === 'object' ? (show.movieId as Movie).poster : ""}
                            alt={typeof show.movieId === 'object' ? (show.movieId as Movie).title : "Movie"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <p className="text-white font-display font-semibold text-lg leading-tight">
                              {typeof show.movieId === 'object' ? (show.movieId as Movie).title : "Movie"}
                            </p>
                            <div className="flex items-center gap-3 text-white/70 text-sm mt-2">
                              <span>{new Date(show.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                              <span className="text-white/40">•</span>
                              <span>{show.time}</span>
                              <span className="text-white/40">•</span>
                              <span className="capitalize">{show.category}</span>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-muted-foreground mb-0.5">Available Seats</p>
                              <p className="font-semibold text-foreground">{show.totalSeats - show.bookedSeats} / {show.totalSeats}</p>
                            </div>
                            {userBooking ? (
                              <Button size="sm" variant="outline" className="rounded-full border-accent text-accent hover:bg-accent hover:text-white">
                                Download Ticket
                              </Button>
                            ) : (
                              <Button size="sm" className="rounded-full">Book Now</Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
            {upcomingShows.length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No upcoming shows found.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Rules Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-10"
        >
          <Card className="bg-muted/50 border-border">
            <CardContent className="p-6">
              <h3 className="font-display font-semibold text-lg text-foreground mb-4">Rules & Guidelines</h3>
              <ul className="space-y-3 text-muted-foreground">
                {[
                  "Only occupy your allocated seat. Seat swapping is strictly prohibited.",
                  "Report any pre-existing damage to the SAC coordinator before the show starts.",
                  "Maintain discipline and respect for university property at all times.",
                  "Carry your student ID for verification at entry."
                ].map((rule, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default StudentDashboard;
