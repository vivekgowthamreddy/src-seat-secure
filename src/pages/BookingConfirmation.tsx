import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, Clock, Armchair, Film, QrCode, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import srcLogo from "@/assets/src-logo.jpg";
import { getShowById, getMovieById } from "@/data/mockData";

const BookingConfirmation = () => {
  const { showId, seatId } = useParams();
  const show = getShowById(showId || "");
  const movie = show ? getMovieById(show.movieId) : null;
  const bookingId = `SRC${Date.now().toString().slice(-8)}`;

  if (!show || !movie) {
    return <div className="min-h-screen flex items-center justify-center"><p>Booking not found</p></div>;
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border">
              <img src={srcLogo} alt="SRC" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-semibold text-foreground">Booking Confirmed</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-seat-available/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-seat-available" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Seat Booked!</h1>
            <p className="text-muted-foreground text-sm">Your seat has been allocated successfully</p>
          </div>

          {/* Ticket Card */}
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="bg-primary p-6 text-center">
              <p className="text-primary-foreground/70 text-sm mb-1">Your Seat Number</p>
              <p className="text-5xl font-display font-bold text-accent">{seatId}</p>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Film className="w-5 h-5 text-muted-foreground" />
                <div><p className="text-xs text-muted-foreground">Movie</p><p className="font-semibold text-foreground">{movie.title}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div><p className="text-xs text-muted-foreground">Date</p><p className="font-semibold text-foreground">{new Date(show.date).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div><p className="text-xs text-muted-foreground">Time</p><p className="font-semibold text-foreground">{show.time}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <Armchair className="w-5 h-5 text-muted-foreground" />
                <div><p className="text-xs text-muted-foreground">Category</p><p className="font-semibold text-foreground capitalize">{show.category} Show</p></div>
              </div>
              
              <div className="border-t border-dashed pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs text-muted-foreground">Booking ID</p><p className="font-mono text-sm font-semibold text-foreground">{bookingId}</p></div>
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center"><QrCode className="w-10 h-10 text-muted-foreground" /></div>
                </div>
              </div>
            </CardContent>
            <div className="bg-destructive/5 p-4 border-t border-destructive/10">
              <p className="text-xs text-center text-destructive font-medium">⚠️ Please occupy only your allocated seat. You are responsible for seat {seatId}.</p>
            </div>
          </Card>

          <Button asChild className="w-full mt-6" size="lg">
            <Link to="/student/dashboard"><Home className="w-4 h-4 mr-2" />Back to Dashboard</Link>
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default BookingConfirmation;
