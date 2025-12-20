import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Film, Users, AlertTriangle, Armchair, LogOut, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import srcLogo from "@/assets/src-logo.jpg";
import { movies, shows } from "@/data/mockData";
import { TOTAL_SEATS } from "@/data/seatLayout";

const AdminDashboard = () => {
  const totalBookedSeats = shows.reduce((acc, show) => acc + show.bookedSeats, 0);
  const damagedSeats = 3; // Mock data

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-primary text-primary-foreground border-b border-primary-foreground/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-foreground/20">
              <img src={srcLogo} alt="SRC" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-display font-semibold">SRC Admin</span>
              <span className="text-primary-foreground/60 text-sm ml-2">Dashboard</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-primary-foreground" asChild>
            <Link to="/"><LogOut className="w-5 h-5" /></Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Welcome, Administrator</h1>
          <p className="text-muted-foreground">SAC Seat Management System</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Seats", value: TOTAL_SEATS, icon: Armchair, color: "text-primary" },
            { label: "Active Movies", value: movies.length, icon: Film, color: "text-accent" },
            { label: "Today's Bookings", value: totalBookedSeats, icon: Users, color: "text-seat-available" },
            { label: "Damaged Seats", value: damagedSeats, icon: AlertTriangle, color: "text-destructive" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {}}>
            <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><Film className="w-5 h-5 text-primary" />Manage Movies</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Add, edit, or remove movies and shows</p></CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {}}>
            <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-destructive" />Damage Tracking</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Report and track seat damage per show</p></CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {}}>
            <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><Settings className="w-5 h-5 text-muted-foreground" />Settings</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Configure system settings</p></CardContent>
          </Card>
        </div>

        {/* Recent Shows */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Shows</CardTitle>
            <Button size="sm"><Plus className="w-4 h-4 mr-1" />Add Show</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {shows.map((show) => {
                const movie = movies.find(m => m.id === show.movieId);
                return (
                  <div key={show.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-foreground">{movie?.title}</p>
                      <p className="text-sm text-muted-foreground">{new Date(show.date).toLocaleDateString()} • {show.time} • {show.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{show.bookedSeats}/{show.totalSeats}</p>
                      <p className="text-xs text-muted-foreground">seats booked</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
