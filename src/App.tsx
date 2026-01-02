import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@/components/theme-provider";

// Lazy load pages for performance
// Lazy load pages for performance
const Index = lazy(() => import("./pages/Index"));
const StudentAuth = lazy(() => import("./pages/StudentAuth"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const MovieListing = lazy(() => import("./pages/MovieListing"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));
const SeatSelection = lazy(() => import("./pages/SeatSelection"));
const BookingConfirmation = lazy(() => import("./pages/BookingConfirmation"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Maintenance = lazy(() => import("./pages/Maintenance"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App = () => (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Maintenance Mode disabled locally for testing */}
                {/* <Route path="/" element={<Maintenance />} /> */}
                {/* <Route path="/student/*" element={<Maintenance />} /> */}

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
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;
