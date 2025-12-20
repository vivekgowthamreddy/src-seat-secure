import { motion } from "framer-motion";
import srcLogoWhite from "@/assets/src-logo-white.png";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="bg-primary text-white py-16"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <img 
              src={srcLogoWhite} 
              alt="SRC" 
              className="h-10 opacity-80"
            />
            <div className="text-center md:text-left">
              <p className="font-display font-semibold text-xl tracking-tight">Student Recreation Club</p>
              <p className="text-sm text-white/50 mt-1">RGUKT Nuzvid • Rajiv Gandhi University of Knowledge Technologies</p>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-white/50">SAC Movie Seat Accountability System</p>
            <p className="text-xs text-white/30 mt-1">© {new Date().getFullYear()} SRC. All rights reserved.</p>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-white/40">
            This platform ensures seat safety, discipline, and accountability during SAC movie screenings.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
