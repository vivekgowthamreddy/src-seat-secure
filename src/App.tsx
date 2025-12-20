import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import StudentAuth from "./pages/StudentAuth";
import AdminLogin from "./pages/AdminLogin";
import StudentDashboard from "./pages/StudentDashboard";
import MovieListing from "./pages/MovieListing";
import MovieDetails from "./pages/MovieDetails";
import SeatSelection from "./pages/SeatSelection";
import BookingConfirmation from "./pages/BookingConfirmation";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/student/login" element={<StudentAuth />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/movies" element={<MovieListing />} />
          <Route path="/student/movie/:id" element={<MovieDetails />} />
          <Route path="/student/seat-selection/:showId" element={<SeatSelection />} />
          <Route path="/student/booking-confirmation/:showId/:seatId" element={<BookingConfirmation />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
