import { motion } from "framer-motion";
import { AlertTriangle, Clock } from "lucide-react";
import srcLogo from "@/assets/src-logo.webp";

const Maintenance = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="z-10 text-center max-w-lg mx-auto"
            >
                <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-card border-4 border-muted flex items-center justify-center shadow-xl">
                    <img src={srcLogo} alt="SRC Logo" className="w-full h-full object-cover rounded-full opacity-80" />
                </div>

                <div className="bg-card/50 backdrop-blur-md border border-border p-8 rounded-2xl shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-yellow-500/10 rounded-full">
                            <Clock className="w-10 h-10 text-yellow-500" />
                        </div>
                    </div>

                    <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                        Under Maintenance
                    </h1>

                    <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                        We are currently performing scheduled maintenance to improve your seat booking experience.
                    </p>

                    <div className="flex items-center justify-center gap-2 text-sm text-yellow-500 bg-yellow-500/5 py-3 px-4 rounded-lg border border-yellow-500/20">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-medium">Please check back later</span>
                    </div>
                </div>

                <p className="mt-8 text-xs text-muted-foreground/50">
                    Student Activity Center • Seat Secure System
                </p>
            </motion.div>
        </div>
    );
};

export default Maintenance;
