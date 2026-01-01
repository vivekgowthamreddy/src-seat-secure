import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiClient, authHelper } from "@/lib/apiClient";
import srcLogo from "@/assets/src-logo.webp";

const StudentAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isVerification, setIsVerification] = useState(false);
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [formData, setFormData] = useState({ email: "", password: "", name: "", otp: "" });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isVerification) {
        await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/auth/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, otp: formData.otp })
        }).then(async res => {
          if (!res.ok) throw new Error(JSON.parse(await res.text()).message);
          return res.json();
        });
        toast({ title: "Verified!", description: "You can now log in." });
        setIsVerification(false);
        setIsLogin(true);
      } else if (isLogin) {
        const response = await apiClient.login(formData.email, formData.password);
        authHelper.setToken(response.accessToken);
        authHelper.setUser(response.user);
        toast({
          title: "Login Successful",
          description: "Welcome back! Redirecting to your dashboard...",
        });
        navigate("/student/dashboard");
      } else {
        if (!gender) throw new Error("Please select your gender");
        const res = await apiClient.register(formData.email, formData.password, formData.name, gender);
        toast({
          title: "Account Created",
          description: res.message || "Please check your email for the OTP.",
        });
        setIsVerification(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient mb-3">
              {isVerification ? "Verify Email" : isLogin ? "Welcome Back" : "Join SAC Movies"}
            </h1>
            <p className="text-muted-foreground">
              {isVerification ? "Enter the OTP sent to your email" : isLogin ? "Sign in to your student account" : "Create your account with college email"}
            </p>
          </div>

          {/* Form Card */}
          <div className="glass rounded-2xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {isVerification && (
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm text-muted-foreground">OTP</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={formData.otp}
                      onChange={handleChange}
                      className="pl-12 h-12 bg-secondary/50 border-border/50 focus:border-primary rounded-xl"
                      required
                    />
                  </div>
                </div>
              )}

              {!isLogin && !isVerification && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="text-sm text-muted-foreground">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-12 h-12 bg-secondary/50 border-border/50 focus:border-primary rounded-xl"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}

              {(!isVerification) && (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm text-muted-foreground">College Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nXXXXXX@rguktn.ac.in"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-12 h-12 bg-secondary/50 border-border/50 focus:border-primary rounded-xl"
                      required
                      disabled={isVerification}
                    />
                  </div>
                </div>
              )}

              {!isVerification && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm text-muted-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-12 h-12 bg-secondary/50 border-border/50 focus:border-primary rounded-xl"
                      required
                    />
                  </div>
                </div>
              )}

              {!isLogin && !isVerification && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2"
                >
                  <Label className="text-sm text-muted-foreground">Gender</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setGender("male")}
                      className={`h-12 rounded-xl border transition-all duration-200 ${gender === "male"
                        ? "bg-gradient-primary border-transparent text-primary-foreground"
                        : "bg-secondary/50 border-border/50 text-foreground hover:border-primary/50"
                        }`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender("female")}
                      className={`h-12 rounded-xl border transition-all duration-200 ${gender === "female"
                        ? "bg-gradient-primary border-transparent text-primary-foreground"
                        : "bg-secondary/50 border-border/50 text-foreground hover:border-primary/50"
                        }`}
                    >
                      Female
                    </button>
                  </div>
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold rounded-xl transition-all duration-200 shadow-glow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {isVerification ? "Verify Email" : isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            {!isVerification && (
              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary hover:underline font-medium"
                  >
                    {isLogin ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </div>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            By signing in, you agree to be responsible for your allocated seat.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default StudentAuth;