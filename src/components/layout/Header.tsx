import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import srcLogo from "@/assets/src-logo.jpg";

interface HeaderProps {
  variant?: "landing" | "student" | "admin";
}

const Header = ({ variant = "landing" }: HeaderProps) => {
  const isLanding = variant === "landing";
  
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 ${
        isLanding 
          ? "bg-primary/95 backdrop-blur-md border-b border-primary-foreground/10" 
          : "bg-card border-b border-border shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-foreground/20 group-hover:border-accent transition-colors">
            <img 
              src={srcLogo} 
              alt="SRC Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className={`font-display font-bold text-lg leading-tight ${
              isLanding ? "text-primary-foreground" : "text-foreground"
            }`}>
              SRC
            </span>
            <span className={`text-xs leading-tight ${
              isLanding ? "text-primary-foreground/70" : "text-muted-foreground"
            }`}>
              RGUKT Nuzvid
            </span>
          </div>
        </Link>
        
        {isLanding && (
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/student/login" 
              className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors font-medium"
            >
              Student Login
            </Link>
            <Link 
              to="/admin/login" 
              className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors font-medium"
            >
              Admin Access
            </Link>
          </nav>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
