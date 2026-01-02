
import { motion } from "framer-motion";
import { Rocket, Star } from "lucide-react";
import srcLogo from "@/assets/src-logo.webp";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LaunchingSoon = () => {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-slate-950 to-slate-950"></div>
                {/* Floating Stars */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-primary/20"
                        initial={{ opacity: 0, scale: 0, x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
                        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [null, Math.random() * -100] }}
                        transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5 }}
                    >
                        <Star className="w-4 h-4 fill-current" />
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 text-center max-w-2xl mx-auto"
            >
                <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-slate-900 border-4 border-primary/20 flex items-center justify-center shadow-2xl relative group">
                    <div className="absolute inset-0 rounded-full border border-white/10 animate-pulse"></div>
                    <img src={srcLogo} alt="SRC Logo" className="w-full h-full object-cover rounded-full" />
                </div>

                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                        <Rocket className="w-4 h-4" />
                        <span>Launching Soon</span>
                    </div>

                    <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50">
                        Get Ready for <br />
                        <span className="text-primary">SRC Showtime</span>
                    </h1>

                    <p className="text-xl text-slate-400 leading-relaxed max-w-lg mx-auto">
                        The ultimate student movie seat booking experience is arriving. Secure your favorite spot with just a click.
                    </p>

                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        {/* Admin Access Removed for Launch Mode */}
                    </div>
                </div>

                <p className="mt-16 text-sm text-slate-600 font-medium tracking-widest uppercase">
                    Student Activity Center • RGUKT
                </p>
            </motion.div>
        </div>
    );
};

export default LaunchingSoon;
