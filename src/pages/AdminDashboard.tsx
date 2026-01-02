import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film, Users, AlertTriangle, Armchair, LogOut, Plus,
  Trash2, Edit2, Save, X, Calendar, Clock, Eye, Download, ArrowLeft
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import srcLogo from "@/assets/src-logo.webp";
import { apiClient, authHelper } from "@/lib/apiClient";
import { TOTAL_SEATS, generateSeatLayout, getGapPosition, getGapClass } from "@/data/seatLayout";
import { Movie, Show } from "@/lib/types";

type AdminView = "dashboard" | "movies" | "shows" | "layout";

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<AdminView>("dashboard");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [shows, setShows] = useState<Show[]>([]);

  const [showMovieForm, setShowMovieForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [movieForm, setMovieForm] = useState({ title: "", poster: "", description: "", duration: "", genre: "" });

  const [showShowForm, setShowShowForm] = useState(false);
  const [showForm, setShowForm] = useState({ movieId: "", date: "", time: "", category: "boys" as "boys" | "girls" | "all" });

  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [showSeats, setShowSeats] = useState<any[]>([]); // New State for show specific seats

  // Global Seat Management State
  const [globalSeats, setGlobalSeats] = useState<any[]>([]);
  const [loadingGlobalSeats, setLoadingGlobalSeats] = useState(false);
  const [seatToToggle, setSeatToToggle] = useState<{ label: string, currentDamaged: boolean } | null>(null);

  const fetchData = async () => {
    try {
      const [m, s] = await Promise.all([apiClient.getMovies(), apiClient.getShows()]);
      setMovies(m);
      setShows(s);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (!authHelper.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (activeView === 'layout') {
      if (selectedShow) {
        // Load specific show seats
        loadShowSeats(selectedShow.id);
      } else {
        // Load global seats
        loadGlobalSeats();
      }
    } else {
      // Clear selection when leaving layout tab (unless navigating back from within layout, handled by arrow button)
      // Actually we want to keep selectedShow null if we are just switching tabs normally
      if (activeView !== 'layout') setSelectedShow(null);
    }
  }, [activeView, selectedShow]);

  const loadShowSeats = async (showId: string) => {
    setLoadingGlobalSeats(true);
    try {
      const seats = await apiClient.getSeats(showId);
      setShowSeats(seats);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load show seats", variant: "destructive" });
    } finally {
      setLoadingGlobalSeats(false);
    }
  };

  const loadGlobalSeats = async () => {
    setLoadingGlobalSeats(true);
    try {
      const data = await apiClient.getGlobalSeats(authHelper.getToken()!);
      setGlobalSeats(data);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load global seat data", variant: "destructive" });
    } finally {
      setLoadingGlobalSeats(false);
    }
  };



  const totalBookedSeats = shows.reduce((acc, show) => acc + (show.bookedSeats || 0), 0);

  const handleSaveMovie = async () => {
    if (!movieForm.title || !movieForm.poster) {
      toast({ title: "Error", description: "Title and poster URL are required", variant: "destructive" });
      return;
    }
    const token = authHelper.getToken();
    if (!token) return;

    try {
      const payload = {
        title: movieForm.title,
        posterUrl: movieForm.poster,
        description: movieForm.description,
        duration: movieForm.duration || "2h 30m",
        genre: movieForm.genre || "Drama",
        language: "Telugu"
      };

      if (editingMovie) {
        await apiClient.updateMovie(token, editingMovie.id, payload);
        toast({ title: "Success", description: `"${movieForm.title}" updated` });
      } else {
        await apiClient.createMovie(token, payload);
        toast({ title: "Success", description: `"${movieForm.title}" added` });
      }
      setMovieForm({ title: "", poster: "", description: "", duration: "", genre: "" });
      setEditingMovie(null);
      setShowMovieForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to save movie", variant: "destructive" });
    }
  };

  const handleDeleteMovie = async (id: string) => {
    const token = authHelper.getToken();
    if (!token) return;
    try {
      await apiClient.deleteMovie(token, id);
      toast({ title: "Deleted", description: "Movie removed" });
      fetchData();
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete movie", variant: "destructive" });
    }
  };

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie);
    setMovieForm({ title: movie.title, poster: movie.poster, description: movie.description, duration: movie.duration, genre: movie.genre });
    setShowMovieForm(true);
  };

  const handleSaveShow = async () => {
    if (!showForm.movieId || !showForm.date || !showForm.time) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" });
      return;
    }
    const token = authHelper.getToken();
    if (!token) return;

    try {
      await apiClient.createShow(token, {
        movieId: showForm.movieId,
        startTime: `${showForm.date}T${showForm.time}:00Z`,
        theaterName: "SAC Auditorium",
        category: showForm.category,
        totalSeats: TOTAL_SEATS
      });
      toast({ title: "Success", description: "Show scheduled" });
      setShowForm({ movieId: "", date: "", time: "", category: "boys" });
      setShowShowForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to create show", variant: "destructive" });
    }
  };

  const handleDeleteShow = async (id: string) => {
    const token = authHelper.getToken();
    if (!token) return;
    try {
      await apiClient.deleteShow(token, id);
      toast({ title: "Deleted", description: "Show removed" });
      fetchData();
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete show", variant: "destructive" });
    }
  };

  const confirmToggleDamage = async () => {
    if (!seatToToggle) return;
    const { label, currentDamaged } = seatToToggle;
    const newDamagedStatus = !currentDamaged;

    try {
      await apiClient.toggleGlobalSeatDamage(authHelper.getToken()!, label, newDamagedStatus);
      toast({
        title: "Success",
        description: `Seat ${label} marked as ${newDamagedStatus ? 'Damaged' : 'Repaired'}`,
      });
      // Refresh global list
      loadGlobalSeats();
      setSeatToToggle(null);
    } catch (err) {
      toast({ title: "Error", description: "Failed to update seat status", variant: "destructive" });
    }
  };

  const handleDownloadReport = async (showId: string) => {
    const token = authHelper.getToken();
    if (!token) return;

    try {
      const verify = await apiClient.verifyReport(token, showId);
      if (!verify.hasBookings) {
        toast({ title: "No Bookings", description: "No students have booked this show yet.", variant: "default" });
        return;
      }

      const blob = await apiClient.downloadReport(token, showId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings-report.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({ title: "Success", description: "Report downloaded" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to download report", variant: "destructive" });
    }
  };

  const navItems = [
    { id: "dashboard" as AdminView, label: "Overview", icon: Armchair },
    { id: "movies" as AdminView, label: "Manage Movies", icon: Film },
    { id: "shows" as AdminView, label: "Manage Shows", icon: Calendar },
    { id: "layout" as AdminView, label: "Auditorium Layout", icon: AlertTriangle },
  ];

  // Generate static layout for Admin View
  const staticLayout = generateSeatLayout();

  return (
    <div className="min-h-screen bg-hero-gradient">
      <header className="bg-card/50 backdrop-blur-xl border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30">
              <img src={srcLogo} alt="SRC" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-semibold text-foreground">SRC Admin</span>
          </div>
          <Button variant="ghost" size="icon" asChild><Link to="/"><LogOut className="w-5 h-5" /></Link></Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <nav className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {navItems.map((item) => (
            <Button key={item.id} variant={activeView === item.id ? "default" : "ghost"} onClick={() => setActiveView(item.id)} className={activeView === item.id ? "bg-gradient-primary shadow-glow" : ""}>
              <item.icon className="w-4 h-4 mr-2" />{item.label}
            </Button>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          {activeView === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="font-display text-2xl font-bold text-foreground mb-6">Welcome, Administrator</h1>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[{ label: "Total Seats", value: TOTAL_SEATS, icon: Armchair }, { label: "Movies", value: movies.length, icon: Film }, { label: "Bookings", value: totalBookedSeats, icon: Users }].map((stat) => (
                  <Card key={stat.label} className="glass"><CardContent className="p-4 flex items-center gap-3"><stat.icon className="w-8 h-8 text-primary" /><div><p className="text-2xl font-bold">{stat.value}</p><p className="text-xs text-muted-foreground">{stat.label}</p></div></CardContent></Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeView === "movies" && (
            <motion.div key="movies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex justify-between mb-6">
                <h1 className="font-display text-2xl font-bold">Manage Movies</h1>
                <Button className="bg-gradient-primary" onClick={() => { setShowMovieForm(true); setEditingMovie(null); setMovieForm({ title: "", poster: "", description: "", duration: "", genre: "" }); }}><Plus className="w-4 h-4 mr-2" />Add Movie</Button>
              </div>
              {showMovieForm && (
                <Card className="glass mb-6"><CardHeader className="flex flex-row justify-between"><CardTitle>{editingMovie ? "Edit" : "Add"} Movie</CardTitle><Button variant="ghost" size="icon" onClick={() => setShowMovieForm(false)}><X className="w-4 h-4" /></Button></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4"><div><Label>Title *</Label><Input value={movieForm.title} onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })} className="bg-secondary/50" /></div><div><Label>Poster URL *</Label><Input value={movieForm.poster} onChange={(e) => setMovieForm({ ...movieForm, poster: e.target.value })} className="bg-secondary/50" /></div></div>
                    <div className="grid md:grid-cols-2 gap-4"><div><Label>Duration</Label><Input value={movieForm.duration} onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })} className="bg-secondary/50" /></div><div><Label>Genre</Label><Input value={movieForm.genre} onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })} className="bg-secondary/50" /></div></div>
                    <Button className="bg-gradient-primary" onClick={handleSaveMovie}><Save className="w-4 h-4 mr-2" />Save</Button>
                  </CardContent>
                </Card>
              )}
              <div className="grid md:grid-cols-3 gap-4">
                {movies.map((movie) => (
                  <Card key={movie.id} className="glass overflow-hidden"><div className="aspect-[2/3] relative"><img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" /><div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background"><h3 className="font-bold">{movie.title}</h3></div></div><CardContent className="p-4 flex gap-2"><Button variant="secondary" size="sm" className="flex-1" onClick={() => handleEditMovie(movie)}><Edit2 className="w-4 h-4 mr-1" />Edit</Button><Button variant="destructive" size="sm" onClick={() => handleDeleteMovie(movie.id)}><Trash2 className="w-4 h-4" /></Button></CardContent></Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeView === "shows" && (
            <motion.div key="shows" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex justify-between mb-6">
                <h1 className="font-display text-2xl font-bold">Manage Shows</h1>
                <Button className="bg-gradient-primary" onClick={() => setShowShowForm(true)}><Plus className="w-4 h-4 mr-2" />Add Show</Button>
              </div>
              {showShowForm && (
                <Card className="glass mb-6"><CardHeader className="flex flex-row justify-between"><CardTitle>Schedule Show</CardTitle><Button variant="ghost" size="icon" onClick={() => setShowShowForm(false)}><X className="w-4 h-4" /></Button></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><Label>Movie *</Label><select value={showForm.movieId} onChange={(e) => setShowForm({ ...showForm, movieId: e.target.value })} className="w-full h-10 px-3 bg-secondary/50 border border-border rounded-lg"><option value="">Select</option>{movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}</select></div>
                      <div><Label>Category</Label><select value={showForm.category} onChange={(e) => setShowForm({ ...showForm, category: e.target.value as "boys" | "girls" | "all" })} className="w-full h-10 px-3 bg-secondary/50 border border-border rounded-lg"><option value="boys">Boys</option><option value="girls">Girls</option><option value="all">All</option></select></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4"><div><Label>Date *</Label><Input type="date" value={showForm.date} onChange={(e) => setShowForm({ ...showForm, date: e.target.value })} className="bg-secondary/50" /></div><div><Label>Time *</Label><Input type="time" value={showForm.time} onChange={(e) => setShowForm({ ...showForm, time: e.target.value })} className="bg-secondary/50" /></div></div>
                    <Button className="bg-gradient-primary" onClick={handleSaveShow}><Save className="w-4 h-4 mr-2" />Schedule</Button>
                  </CardContent>
                </Card>
              )}
              <div className="space-y-3">
                {shows.map((show) => {
                  const movie = typeof show.movieId === 'object' ? show.movieId as Movie : movies.find(m => m.id === show.movieId);
                  return (
                    <Card key={show.id} className="glass"><CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">{movie && <img src={movie.poster} alt="" className="w-12 h-18 object-cover rounded" />}<div><h3 className="font-semibold">{movie?.title || 'Unknown Movie'}</h3><p className="text-sm text-muted-foreground"><Calendar className="w-3 h-3 inline mr-1" />{show.date} <Clock className="w-3 h-3 inline mx-1" />{show.time} <span className="ml-2 px-2 py-0.5 bg-primary/20 rounded text-xs">{show.category}</span></p></div></div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleDownloadReport(show.id)} title="Download Report">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => { setSelectedShow(show); setActiveView("layout"); }}><Eye className="w-4 h-4" /></Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteShow(show.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </CardContent></Card>
                  );
                })}
              </div>
            </motion.div>
          )}


          {activeView === "layout" && (
            <motion.div key="layout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                {selectedShow && (
                  <Button variant="outline" size="icon" onClick={() => { setSelectedShow(null); setActiveView("shows"); }}>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                )}
                <div>
                  <h1 className="font-display text-2xl font-bold">{selectedShow ? "Track Show Bookings" : "Manage Auditorium Layout (Global)"}</h1>
                  {selectedShow && <p className="text-muted-foreground">{selectedShow.date} | {selectedShow.time} ({selectedShow.category})</p>}
                </div>
              </div>

              {!selectedShow && (
                <p className="text-muted-foreground mb-4">
                  Mark seats as "Damaged" to make them unavailable for ALL current and future movies.
                  <br />
                  <span className="text-xs">Click a seat to toggle its status.</span>
                </p>
              )}

              <Card className="glass">
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-success/70" /> Available</div>
                      {selectedShow ? (
                        <>
                          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-primary" /> Booked</div>
                          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-destructive/50" /> Damaged</div>
                        </>
                      ) : (
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-destructive" /> Damaged</div>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  {loadingGlobalSeats ? <div className="p-8 text-center">Loading layout...</div> : (
                    <div className="min-w-[700px] flex justify-center">
                      <div className="inline-block">
                        <div className="text-center mb-6"><div className="h-2 bg-gradient-primary rounded-full mx-auto w-3/4 mb-1" /><span className="text-xs text-muted-foreground">SCREEN</span></div>
                        <div className="space-y-1">
                          {staticLayout.map((row) => (
                            <div key={row.name} className={`flex items-center gap-1 justify-center ${row.name === 'H' ? 'mb-8' : ''}`}>
                              <span className="w-5 text-xs text-muted-foreground text-right mr-2">{row.name}</span>
                              <div className="flex gap-0.5">
                                {row.seats.map((seat) => {
                                  // Determine status based on mode
                                  let statusClass = "bg-success/70 text-white";
                                  let title = "Available";
                                  let disabled = false;

                                  if (selectedShow) {
                                    // Show Booking Mode
                                    // We need showSeats state which isn't implemented here yet. 
                                    // Let's rely on a new state `showSeats` populated when `selectedShow` changes.
                                    const seatData = showSeats.find(s => s.seatLabel === seat.id);
                                    if (seatData) {
                                      if (seatData.status === 'booked') {
                                        statusClass = "bg-primary text-white";
                                        title = `Booked by ${seatData.bookedBy || 'User'}`;
                                      } else if (seatData.status === 'damaged') {
                                        statusClass = "bg-destructive/50 text-white";
                                        title = "Damaged";
                                      } else if (seatData.status === 'unavailable') {
                                        statusClass = "bg-muted text-muted-foreground";
                                        title = "Unavailable";
                                      }
                                    }
                                    disabled = true; // Just viewing
                                  } else {
                                    // Global Edit Mode
                                    const globalStatus = globalSeats.find(s => s.seatLabel === seat.id);
                                    const isDamaged = globalStatus?.isDamaged || false;
                                    if (isDamaged) {
                                      statusClass = "bg-destructive text-white ring-2 ring-destructive/50";
                                      title = "Damaged";
                                    } else {
                                      statusClass = "bg-success/70 hover:bg-success text-white";
                                      title = "Good Condition";
                                    }
                                  }

                                  const gapPos = getGapPosition(row.name);

                                  return (
                                    <div key={seat.id} className="flex gap-0.5">
                                      {selectedShow ? (
                                        <div
                                          className={`w-6 h-6 rounded text-[9px] flex items-center justify-center ${statusClass}`}
                                          title={`${seat.id} - ${title}`}
                                        >
                                          {seat.number}
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => setSeatToToggle({ label: seat.id, currentDamaged: statusClass.includes('destructive') })}
                                          className={`w-6 h-6 rounded text-[9px] transition-all hover:scale-110 ${statusClass}`}
                                          title={`${seat.id} - ${title}`}
                                        >
                                          {seat.number}
                                        </button>
                                      )}
                                      {seat.number === gapPos && <div className={getGapClass(row.name)} />}
                                    </div>
                                  );
                                })}
                              </div>
                              <span className="w-5 text-xs text-muted-foreground ml-2">{row.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Confirmation Dialog (Simple Modal Implementation) */}
              {seatToToggle && !selectedShow && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-card border border-border p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4"
                  >
                    <h3 className="font-display text-lg font-semibold mb-2">Confirm Action</h3>
                    <p className="text-muted-foreground mb-6">
                      {seatToToggle.currentDamaged
                        ? `Would you like to mark seat ${seatToToggle.label} as REPAIRED (Available)?`
                        : `Would you like to convert seat ${seatToToggle.label} into the DAMAGED one? This will affect all shows.`
                      }
                    </p>
                    <div className="flex gap-3 justify-end">
                      <Button variant="outline" onClick={() => setSeatToToggle(null)}>Cancel</Button>
                      <Button
                        variant={seatToToggle.currentDamaged ? "default" : "destructive"}
                        onClick={confirmToggleDamage}
                      >
                        Yes, {seatToToggle.currentDamaged ? "Repair" : "Mark Damaged"}
                      </Button>
                    </div>
                  </motion.div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;