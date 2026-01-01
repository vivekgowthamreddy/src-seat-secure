import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiClient, authHelper } from "@/lib/apiClient";
import srcLogo from "@/assets/src-logo.webp";
import { useGoogleLogin } from "@react-oauth/google";

const StudentAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();


  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        console.log("Google Token Response:", tokenResponse);
        const response = await apiClient.googleLogin(tokenResponse.access_token);

        authHelper.setToken(response.accessToken);
        authHelper.setUser(response.user);

        toast({
          title: "Login Successful",
          description: "Welcome back! Redirecting to your dashboard...",
        });
        navigate("/student/dashboard");
      } catch (error: any) {
        console.error("Login Error:", error);
        let message = "Something went wrong";
        if (error.message) {
          if (error.message.includes("Email domain not allowed")) {
            message = "Only authorized students (n/o/s + 6-7 digits @ rgukt...) are allowed.";
          } else {
            try {
              const parsed = JSON.parse(error.message);
              message = parsed.message || message;
            } catch (e) {
              message = error.message;
            }
          }
        }

        toast({
          title: "Authentication Failed",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Google Login failed. Please try again.",
        variant: "destructive",
      });
    },
  });



  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-glow opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-glow opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 py-4">
        <div className="container mx-auto px-4 flex items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border">
              <img src={srcLogo} alt="SRC Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-semibold text-foreground">Return Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient mb-4">
              Student Portal
            </h1>
            <p className="text-lg text-muted-foreground">
              Sign in with your university account
            </p>
          </div>

          {/* Login Card */}
          <div className="glass rounded-2xl p-8 md:p-10 shadow-2xl border border-white/10 backdrop-blur-xl bg-black/40">
            <div className="space-y-6">

              <div className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.858.59-4.18" />
                  </svg>
                </div>
                <p className="text-sm text-gray-400">
                  Use your official college email ID to proceed.
                </p>
              </div>

              <Button
                type="button"
                onClick={() => handleGoogleLogin()}
                disabled={isLoading}
                className="w-full h-14 bg-white text-black hover:bg-gray-100 font-bold rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-3 text-lg"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Sign in with Google</span>
                  </>
                )}
              </Button>

              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-center text-xs text-muted-foreground/60">
                  Only emails matching <code>n/s/oXXXXXX@rgukt(n/sklm/ong).ac.in</code> are allowed.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default StudentAuth;