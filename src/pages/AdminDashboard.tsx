import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Film, Users, AlertTriangle, Armchair, LogOut, Plus, 
  Trash2, Edit2, Save, X, Calendar, Clock, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import srcLogo from "@/assets/src-logo.jpg";
import { movies as initialMovies, shows as initialShows, Movie, Show } from "@/data/mockData";
import { TOTAL_SEATS, generateSeatLayout } from "@/data/seatLayout";

type AdminView = "dashboard" | "movies" | "shows" | "damage";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<AdminView>("dashboard");
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [shows, setShows] = useState<Show[]>(initialShows);
  
  const [showMovieForm, setShowMovieForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [movieForm, setMovieForm] = useState({ title: "", poster: "", description: "", duration: "", genre: "" });
  
  const [showShowForm, setShowShowForm] = useState(false);
  const [showForm, setShowForm] = useState({ movieId: "", date: "", time: "", category: "boys" as "boys" | "girls" | "all" });
  
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [damagedSeats, setDamagedSeats] = useState<Set<string>>(new Set(["G-15", "J-22"]));

  const totalBookedSeats = shows.reduce((acc, show) => acc + show.bookedSeats, 0);

  const handleSaveMovie = () => {
    if (!movieForm.title || !movieForm.poster) {
      toast({ title: "Error", description: "Title and poster URL are required", variant: "destructive" });
      return;
    }
    if (editingMovie) {
      setMovies(movies.map(m => m.id === editingMovie.id ? { ...m, ...movieForm, language: "Telugu" } : m));
      toast({ title: "Success", description: `"${movieForm.title}" updated` });
    } else {
      const newMovie: Movie = { id: `movie-${Date.now()}`, ...movieForm, duration: movieForm.duration || "2h 30m", genre: movieForm.genre || "Drama", language: "Telugu" };
      setMovies([...movies, newMovie]);
      toast({ title: "Success", description: `"${movieForm.title}" added` });
    }
    setMovieForm({ title: "", poster: "", description: "", duration: "", genre: "" });
    setEditingMovie(null);
    setShowMovieForm(false);
  };

  const handleDeleteMovie = (id: string) => {
    const movie = movies.find(m => m.id === id);
    setMovies(movies.filter(m => m.id !== id));
    setShows(shows.filter(s => s.movieId !== id));
    toast({ title: "Deleted", description: `"${movie?.title}" removed` });
  };

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie);
    setMovieForm({ title: movie.title, poster: movie.poster, description: movie.description, duration: movie.duration, genre: movie.genre });
    setShowMovieForm(true);
  };

  const handleSaveShow = () => {
    if (!showForm.movieId || !showForm.date || !showForm.time) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" });
      return;
    }
    const newShow: Show = { id: `show-${Date.now()}`, movieId: showForm.movieId, date: showForm.date, time: showForm.time, category: showForm.category, bookedSeats: 0, totalSeats: TOTAL_SEATS };
    setShows([...shows, newShow]);
    toast({ title: "Success", description: "Show scheduled" });
    setShowForm({ movieId: "", date: "", time: "", category: "boys" });
    setShowShowForm(false);
  };

  const handleDeleteShow = (id: string) => {
    setShows(shows.filter(s => s.id !== id));
    toast({ title: "Deleted", description: "Show removed" });
  };

  const toggleSeatDamage = (seatId: string) => {
    const newDamaged = new Set(damagedSeats);
    if (newDamaged.has(seatId)) {
      newDamaged.delete(seatId);
      toast({ title: "Restored", description: `Seat ${seatId} clean` });
    } else {
      newDamaged.add(seatId);
      toast({ title: "Reported", description: `Seat ${seatId} damaged`, variant: "destructive" });
    }
    setDamagedSeats(newDamaged);
  };

  const seatLayout = generateSeatLayout();
  const navItems = [
    { id: "dashboard" as AdminView, label: "Overview", icon: Armchair },
    { id: "movies" as AdminView, label: "Manage Movies", icon: Film },
    { id: "shows" as AdminView, label: "Manage Shows", icon: Calendar },
    { id: "damage" as AdminView, label: "Damage Tracking", icon: AlertTriangle },
  ];

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
                {[{ label: "Total Seats", value: TOTAL_SEATS, icon: Armchair }, { label: "Movies", value: movies.length, icon: Film }, { label: "Bookings", value: totalBookedSeats, icon: Users }, { label: "Damaged", value: damagedSeats.size, icon: AlertTriangle }].map((stat) => (
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
                {shows.map((show) => { const movie = movies.find(m => m.id === show.movieId); return (
                  <Card key={show.id} className="glass"><CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">{movie && <img src={movie.poster} alt="" className="w-12 h-18 object-cover rounded" />}<div><h3 className="font-semibold">{movie?.title}</h3><p className="text-sm text-muted-foreground"><Calendar className="w-3 h-3 inline mr-1" />{show.date} <Clock className="w-3 h-3 inline mx-1" />{show.time} <span className="ml-2 px-2 py-0.5 bg-primary/20 rounded text-xs">{show.category}</span></p></div></div>
                    <div className="flex gap-2"><Button variant="secondary" size="sm" onClick={() => { setSelectedShow(show); setActiveView("damage"); }}><Eye className="w-4 h-4" /></Button><Button variant="destructive" size="sm" onClick={() => handleDeleteShow(show.id)}><Trash2 className="w-4 h-4" /></Button></div>
                  </CardContent></Card>
                ); })}
              </div>
            </motion.div>
          )}

          {activeView === "damage" && (
            <motion.div key="damage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="font-display text-2xl font-bold mb-6">Damage Tracking</h1>
              <Card className="glass mb-6"><CardContent className="p-4"><Label>Select Show</Label><select value={selectedShow?.id || ""} onChange={(e) => setSelectedShow(shows.find(s => s.id === e.target.value) || null)} className="w-full h-10 px-3 bg-secondary/50 border border-border rounded-lg mt-2"><option value="">Choose</option>{shows.map(s => { const m = movies.find(x => x.id === s.movieId); return <option key={s.id} value={s.id}>{m?.title} - {s.date}</option>; })}</select></CardContent></Card>
              {selectedShow && (
                <Card className="glass"><CardHeader><CardTitle>Click seats to mark Damaged/Clean</CardTitle></CardHeader><CardContent className="overflow-x-auto">
                  <div className="min-w-[700px]">
                    <div className="text-center mb-6"><div className="h-2 bg-gradient-primary rounded-full mx-auto w-3/4 mb-1" /><span className="text-xs text-muted-foreground">SCREEN</span></div>
                    <div className="space-y-1">
                      {seatLayout.map((row) => (
                        <div key={row.name} className="flex items-center gap-1 justify-center">
                          <span className="w-5 text-xs text-muted-foreground">{row.name}</span>
                          <div className="flex gap-0.5">{row.seats.map((seat) => {
                            const seatId = `${row.name}-${seat.number}`;
                            const isDamaged = damagedSeats.has(seatId);
                            return <button key={seat.id} onClick={() => toggleSeatDamage(seatId)} className={`w-5 h-5 rounded text-[8px] transition-all hover:scale-110 ${isDamaged ? "bg-destructive" : "bg-success/70 hover:bg-success"}`}>{seat.number}</button>;
                          })}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent></Card>
              )}
              {damagedSeats.size > 0 && <Card className="glass mt-6"><CardHeader><CardTitle className="text-destructive"><AlertTriangle className="w-4 h-4 inline mr-2" />Damaged ({damagedSeats.size})</CardTitle></CardHeader><CardContent><div className="flex flex-wrap gap-2">{Array.from(damagedSeats).map(s => <span key={s} onClick={() => toggleSeatDamage(s)} className="px-2 py-1 bg-destructive/20 text-destructive rounded cursor-pointer text-sm">{s} ✕</span>)}</div></CardContent></Card>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;