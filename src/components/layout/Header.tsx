import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import srcLogo from "@/assets/src-logo.webp";

import { ModeToggle } from "@/components/mode-toggle";

interface HeaderProps {
  variant?: "landing" | "student" | "admin";
}

const Header = ({ variant = "landing" }: HeaderProps) => {
  const isLanding = variant === "landing";

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 ${isLanding
        ? "bg-transparent"
        : "bg-card/95 backdrop-blur-md border-b border-border"
        }`}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          <div className={`w-11 h-11 rounded-full overflow-hidden ring-2 transition-all ${isLanding
            ? "ring-white/20 group-hover:ring-white/40"
            : "ring-border group-hover:ring-accent/50"
            }`}>
            <img
              src={srcLogo}
              alt="SRC Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className={`font-display font-semibold text-xl leading-tight tracking-tight ${isLanding ? "text-white" : "text-foreground"
              }`}>
              SRC
            </span>
            <span className={`text-xs leading-tight tracking-wide ${isLanding ? "text-white/60" : "text-muted-foreground"
              }`}>
              RGUKT Nuzvid
            </span>
          </div>
        </Link>

        {isLanding ? (
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/student/login"
                className="text-sm text-white/70 hover:text-white transition-colors font-medium tracking-wide"
              >
                Student Login
              </Link>
              <Link
                to="/admin/login"
                className="text-sm text-white/70 hover:text-white transition-colors font-medium tracking-wide"
              >
                Admin Access
              </Link>
            </nav>
            <ModeToggle />
          </div>
        ) : (
          <ModeToggle />
        )}
      </div>
    </motion.header>
  );
};

export default Header;
