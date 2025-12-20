import { motion } from "framer-motion";
import srcLogoWhite from "@/assets/src-logo-white.png";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="bg-primary text-primary-foreground py-12"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src={srcLogoWhite} 
              alt="SRC" 
              className="h-8 opacity-90"
            />
            <div className="text-center md:text-left">
              <p className="font-display font-semibold text-lg">Student Recreation Club</p>
              <p className="text-sm text-primary-foreground/70">RGUKT Nuzvid • Rajiv Gandhi University of Knowledge Technologies</p>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-primary-foreground/70">SAC Movie Seat Accountability System</p>
            <p className="text-xs text-primary-foreground/50 mt-1">© {new Date().getFullYear()} SRC. All rights reserved.</p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-primary-foreground/10 text-center">
          <p className="text-xs text-primary-foreground/50">
            This platform ensures seat safety, discipline, and accountability during SAC movie screenings.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
