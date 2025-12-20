import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Monitor, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import srcLogo from "@/assets/src-logo.jpg";
import { getShowById, getMovieById } from "@/data/mockData";
import { ROWS, getSeatsForRow, hasCenterAisle, type SeatStatus } from "@/data/seatLayout";

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  
  const show = getShowById(showId || "");
  const movie = show ? getMovieById(show.movieId) : null;

  // Mock booked seats
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
      navigate(`/student/booking-confirmation/${showId}/${selectedSeat}`);
    }
  };

  if (!show || !movie) {
    return <div className="min-h-screen flex items-center justify-center"><p>Show not found</p></div>;
  }

  return (
    <div className="min-h-screen bg-primary">
      <header className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-primary-foreground" asChild>
              <Link to={`/student/movie/${show.movieId}`}><ArrowLeft className="w-5 h-5" /></Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary-foreground/20">
                <img src={srcLogo} alt="SRC" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-semibold text-primary-foreground">Select Seat</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Screen */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
          <div className="relative mx-auto max-w-2xl">
            <div className="h-2 bg-accent rounded-full mb-2 shadow-glow" />
            <div className="flex items-center justify-center gap-2 text-primary-foreground/60 text-sm">
              <Monitor className="w-4 h-4" /><span>SCREEN</span>
            </div>
          </div>
        </motion.div>

        {/* Seat Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="overflow-x-auto pb-4">
          <div className="min-w-[600px] max-w-4xl mx-auto space-y-1">
            {ROWS.map((rowName) => (
              <div key={rowName} className="flex items-center gap-2">
                <span className="w-6 text-xs text-primary-foreground/60 font-medium">{rowName}</span>
                <div className="flex-1 flex justify-center gap-1 flex-wrap">
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
                          className={`w-5 h-5 md:w-6 md:h-6 rounded text-[8px] md:text-[10px] font-medium transition-all ${
                            status === 'selected' ? 'bg-seat-selected text-accent-foreground scale-110 shadow-lg' :
                            status === 'booked' ? 'bg-seat-booked/60 text-primary-foreground/50 cursor-not-allowed' :
                            'bg-seat-available hover:bg-seat-available/80 text-primary-foreground cursor-pointer'
                          }`}
                        >
                          {seatNum}
                        </button>
                        {showAisle && <div className="w-4" />}
                      </div>
                    );
                  })}
                </div>
                <span className="w-6 text-xs text-primary-foreground/60 font-medium">{rowName}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Legend */}
        <div className="flex justify-center gap-6 my-6 text-sm text-primary-foreground/80">
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-seat-available" /><span>Available</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-seat-booked/60" /><span>Booked</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-seat-selected" /><span>Selected</span></div>
        </div>

        {/* Selection Panel */}
        {selectedSeat && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="max-w-md mx-auto border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground">Your Selected Seat</p>
                  <p className="text-4xl font-display font-bold text-foreground">{selectedSeat}</p>
                  <p className="text-sm text-muted-foreground mt-1">{movie.title} • {show.time}</p>
                </div>
                <div className="bg-destructive/10 p-3 rounded-lg mb-4 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-destructive">Damage to this seat will be traced to you.</p>
                </div>
                <Button onClick={handleConfirm} className="w-full" size="lg" variant="hero">
                  Confirm Seat {selectedSeat}
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
