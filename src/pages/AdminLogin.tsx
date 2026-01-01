import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import srcLogo from "@/assets/src-logo.jpg";
import { apiClient, authHelper } from "@/lib/apiClient";

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.login(formData.email, formData.password);

      if (response.user.role !== 'admin') {
        throw new Error('Access denied: Admin privileges required');
      }

      authHelper.setToken(response.accessToken);
      authHelper.setUser(response.user);

      toast({
        title: "Admin Login Successful",
        description: "Welcome to the admin dashboard.",
      });
      navigate("/admin/dashboard");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <ArrowLeft className="w-5 h-5 text-primary-foreground/70 group-hover:text-primary-foreground transition-colors" />
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-foreground/20">
              <img src={srcLogo} alt="SRC Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-semibold text-primary-foreground">SRC</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h1 className="font-display text-2xl font-bold text-primary-foreground mb-2">
              Admin Access Only
            </h1>
            <p className="text-primary-foreground/60 text-sm">
              Authorized personnel only. All access is logged.
            </p>
          </div>

          <Card className="border-0 shadow-2xl bg-card">
            <CardHeader className="text-center pb-4">
              <CardTitle className="font-display text-xl">Administrator Login</CardTitle>
              <CardDescription>
                Enter your admin credentials to continue
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@college.edu"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter password"
                      className="pl-10"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Authenticating..." : "Access Dashboard"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 p-4 bg-primary-foreground/5 rounded-xl border border-primary-foreground/10">
            <p className="text-center text-xs text-primary-foreground/50">
              This is a restricted area. Unauthorized access attempts will be reported to campus security.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminLogin;
