import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Monitor, AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import srcLogo from "@/assets/src-logo.jpg";
import { getShowById, getMovieById } from "@/data/mockData";
import { ROWS, getSeatsForRow, hasCenterAisle, type SeatStatus } from "@/data/seatLayout";

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  
  const show = getShowById(showId || "");
  const movie = show ? getMovieById(show.movieId) : null;

  const bookedSeats = new Set(['A5', 'A6', 'B10', 'C15', 'D20', 'E25', 'F30', 'G12', 'H8']);

  const getSeatStatus = (seatId: string): SeatStatus => {
    if (selectedSeat === seatId) return 'selected';
    if (bookedSeats.has(seatId)) return 'booked';
    return 'available';
  };

  const handleSeatClick = (seatId: string) => {
    if (bookedSeats.has(seatId)) return;
    setSelectedSeat(seatId === selectedSeat ? null : seatId);
  };

  const handleConfirm = () => {
    if (selectedSeat) {
      setIsConfirming(true);
      setTimeout(() => {
        toast({
          title: "Seat Confirmed!",
          description: `Seat ${selectedSeat} has been allocated to you.`,
        });
        navigate(`/student/booking-confirmation/${showId}/${selectedSeat}`);
      }, 800);
    }
  };

  if (!show || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Show not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
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
              <span className="font-display font-semibold text-white">Select Your Seat</span>
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
            {ROWS.map((rowName) => (
              <div key={rowName} className="flex items-center gap-3 mb-1.5">
                <span className="w-6 text-xs text-white/50 font-medium text-right">{rowName}</span>
                <div className="flex-1 flex justify-center gap-1">
                  {Array.from({ length: getSeatsForRow(rowName) }, (_, i) => {
                    const seatNum = i + 1;
                    const seatId = `${rowName}${seatNum}`;
                    const status = getSeatStatus(seatId);
                    const showAisle = hasCenterAisle(rowName) && seatNum === 17;
                    
                    return (
                      <div key={seatId} className="flex items-center">
                        <button
                          onClick={() => handleSeatClick(seatId)}
                          disabled={status === 'booked'}
                          className={`w-6 h-6 rounded text-[9px] font-medium transition-all duration-200 ${
                            status === 'selected' 
                              ? 'bg-accent text-white scale-110 shadow-lg ring-2 ring-accent/50' 
                              : status === 'booked' 
                                ? 'bg-white/20 text-white/30 cursor-not-allowed' 
                                : 'bg-success hover:bg-success/80 text-white cursor-pointer hover:scale-105'
                          }`}
                        >
                          {seatNum}
                        </button>
                        {showAisle && <div className="w-6" />}
                      </div>
                    );
                  })}
                </div>
                <span className="w-6 text-xs text-white/50 font-medium">{rowName}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Legend */}
        <div className="flex justify-center gap-8 my-8 text-sm text-white/70">
          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-success" /><span>Available</span></div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-white/20" /><span>Booked</span></div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-accent" /><span>Selected</span></div>
        </div>

        {/* Selection Panel */}
        {selectedSeat && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="max-w-md mx-auto border-0 shadow-2xl bg-card">
              <CardContent className="p-6">
                <div className="text-center mb-5">
                  <p className="text-sm text-muted-foreground mb-1">Your Selected Seat</p>
                  <p className="text-5xl font-display font-semibold text-foreground">{selectedSeat}</p>
                  <p className="text-sm text-muted-foreground mt-2">{movie.title} • {show.time}</p>
                </div>
                <div className="bg-destructive/10 p-4 rounded-xl mb-5 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-destructive">Damage to this seat will be traced to you.</p>
                </div>
                <Button 
                  onClick={handleConfirm} 
                  className="w-full rounded-full" 
                  size="lg" 
                  disabled={isConfirming}
                >
                  {isConfirming ? (
                    <>Confirming...</>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Confirm Seat {selectedSeat}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default SeatSelection;
