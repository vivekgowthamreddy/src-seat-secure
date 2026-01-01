import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Monitor, AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiClient, authHelper } from "@/lib/apiClient";
import srcLogo from "@/assets/src-logo.jpg";
import heroImage from "@/assets/sac-auditorium-real.jpg";
import { ROWS, getSeatsForRow, hasCenterAisle, type SeatStatus } from "@/data/seatLayout";
import type { Show, Movie, SeatRow } from "@/lib/types";

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [isConfirming, setIsConfirming] = useState(false);
  const [show, setShow] = useState<Show | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [seatRows, setSeatRows] = useState<SeatRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const showData = await apiClient.getShow(showId || "");
        setShow(showData);

        // Handle populated movieId
        const movieData = typeof showData.movieId === 'object'
          ? showData.movieId
          : await apiClient.getMovie(showData.movieId);

        setMovie(movieData);
        const seatsData = await apiClient.getSeats(showId || "");
        setSeatRows(seatsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [showId]);

  const getBookedSeats = (): Set<string> => {
    const booked = new Set<string>();
    seatRows.forEach(row => {
      row.seats.forEach(seat => {
        if (seat.status === 'booked') {
          booked.add(seat.id);
        }
      });
    });
    return booked;
  };

  const getUnavailableSeats = (): Set<string> => {
    const unavailable = new Set<string>();
    seatRows.forEach(row => {
      row.seats.forEach(seat => {
        if (seat.status === 'unavailable') {
          unavailable.add(seat.id);
        }
      });
    });
    return unavailable;
  }

  const bookedSeats = getBookedSeats();
  const unavailableSeats = getUnavailableSeats();

  const getSeatStatus = (seatId: string): SeatStatus | 'unavailable' => {
    if (selectedSeats.has(seatId)) return 'selected';
    if (bookedSeats.has(seatId)) return 'booked';
    if (unavailableSeats.has(seatId)) return 'unavailable';
    return 'available';
  };

  const handleSeatClick = (seatId: string) => {
    if (bookedSeats.has(seatId) || unavailableSeats.has(seatId)) return;
    const newSelected = new Set(selectedSeats);

    if (newSelected.has(seatId)) {
      newSelected.delete(seatId);
    } else {
      // Clear previous selection to enforce 1 seat limit
      newSelected.clear();
      newSelected.add(seatId);
    }
    setSelectedSeats(newSelected);
  };

  const handleConfirm = async () => {
    if (selectedSeats.size === 0) return;
    if (selectedSeats.size > 1) {
      toast({ title: "Limit Exceeded", description: "You can only book 1 seat.", variant: "destructive" });
      return;
    }

    const token = authHelper.getToken();
    if (!token) {
      toast({ title: "Error", description: "Please login first", variant: "destructive" });
      navigate("/student/login");
      return;
    }

    setIsConfirming(true);
    try {
      await apiClient.createBooking(token, showId || "", Array.from(selectedSeats));
      toast({
        title: "Booking Confirmed!",
        description: `Seat ${Array.from(selectedSeats).join(', ')} booked successfully.`,
      });
      navigate(`/student/booking-confirmation/${showId}/${Array.from(selectedSeats).join(',')}`);
    } catch (err) {
      toast({
        title: "Booking Failed",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">Loading seats...</div>;
  }

  if (error || !show || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">{error || "Show not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="SAC Auditorium" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/90" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="border-b border-white/10">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" asChild>
                <Link to={`/student/movie/${show.movieId}`}><ArrowLeft className="w-5 h-5" /></Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/20">
                  <img src={srcLogo} alt="SRC" className="w-full h-full object-cover" />
                </div>
                <span className="font-display font-semibold text-white">Select Seats</span>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          {/* Screen */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
            <div className="relative mx-auto max-w-xl">
              <div className="h-1.5 bg-accent rounded-full shadow-glow" />
              <div className="flex items-center justify-center gap-2 text-white/50 text-sm mt-3 tracking-wide">
                <Monitor className="w-4 h-4" /><span>SCREEN</span>
              </div>
            </div>
          </motion.div>

          {/* Seat Grid - Organized */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="overflow-x-auto pb-4">
            <div className="min-w-[700px] max-w-4xl mx-auto">
              {seatRows.map((row) => (
                <div key={row.name} className="flex items-center gap-3 mb-1.5">
                  <span className="w-6 text-xs text-white/50 font-medium text-right">{row.name}</span>
                  <div className="flex-1 flex justify-center gap-1">
                    {row.seats.map((seat) => {
                      const status = getSeatStatus(seat.id);
                      const showAisle = hasCenterAisle(row.name) && seat.number === 17;

                      return (
                        <div key={seat.id} className="flex items-center">
                          <button
                            onClick={() => handleSeatClick(seat.id)}
                            disabled={status === 'booked' || status === 'unavailable'}
                            className={`w-6 h-6 rounded text-[9px] font-medium transition-all duration-200 ${status === 'selected'
                              ? 'bg-accent text-white scale-110 shadow-lg ring-2 ring-accent/50'
                              : status === 'booked'
                                ? 'bg-white/20 text-white/30 cursor-not-allowed'
                                : status === 'unavailable'
                                  ? 'bg-destructive text-white cursor-not-allowed opacity-80'
                                  : 'bg-success hover:bg-success/80 text-white cursor-pointer hover:scale-105'
                              }`}
                          >
                            {seat.number}
                          </button>
                          {showAisle && <div className="w-6" />}
                        </div>
                      );
                    })}
                  </div>
                  <span className="w-6 text-xs text-white/50 font-medium">{row.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Legend */}
          <div className="flex justify-center gap-8 my-8 text-sm text-white/70">
            <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-success" /><span>Available</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-white/20" /><span>Booked</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-destructive" /><span>Unavailable</span></div>
            <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-accent" /><span>Selected</span></div>
          </div>

          {/* Selection Panel */}
          {selectedSeats.size > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="max-w-md mx-auto border-0 shadow-2xl bg-card">
                <CardContent className="p-6">
                  <div className="text-center mb-5">
                    <p className="text-sm text-muted-foreground mb-1">Selected Seat</p>
                    <p className="text-3xl font-display font-semibold text-foreground">{Array.from(selectedSeats).join(', ')}</p>
                    <p className="text-sm text-muted-foreground mt-2">{movie.title} • {show.time}</p>
                    <p className="text-lg font-semibold text-success mt-3">Free</p>
                  </div>
                  <div className="bg-destructive/10 p-4 rounded-xl mb-5 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-destructive">Damage to seats will be traced to you.</p>
                  </div>
                  <Button
                    onClick={handleConfirm}
                    className="w-full rounded-full"
                    size="lg"
                    disabled={isConfirming || selectedSeats.size === 0}
                  >
                    {isConfirming ? (
                      <>Confirming...</>
                    ) : (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Confirm {selectedSeats.size} Seat(s)
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </main>
      </div>
    </div >
  );
};

export default SeatSelection;