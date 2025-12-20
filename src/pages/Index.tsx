import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Users, CheckCircle, AlertTriangle, ArrowRight, Film, Armchair } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import heroImage from "@/assets/hero-auditorium.jpg";
import { TOTAL_SEATS } from "@/data/seatLayout";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="landing" />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="SAC Auditorium" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-hero-gradient opacity-90" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 pt-20 pb-12">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-6"
            >
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-primary-foreground/90">Official SRC Platform</span>
            </motion.div>
            
            <motion.h1
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight"
            >
              SAC Movie Seat
              <br />
              <span className="text-accent">Accountability System</span>
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Ensuring seat safety, discipline, and accountability during SAC movie screenings. 
              A digital platform by the Student Recreation Club, RGUKT Nuzvid.
            </motion.p>
            
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild size="xl" variant="hero">
                <Link to="/student/login">
                  Student Login
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="heroOutline">
                <Link to="/admin/login">
                  Admin Access
                </Link>
              </Button>
            </motion.div>
            
            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold text-accent">{TOTAL_SEATS}</div>
                <div className="text-sm text-primary-foreground/60 mt-1">Total Seats</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold text-accent">18</div>
                <div className="text-sm text-primary-foreground/60 mt-1">Rows</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold text-accent">1</div>
                <div className="text-sm text-primary-foreground/60 mt-1">Seat Per Student</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-primary-foreground/60 rounded-full"
            />
          </div>
        </motion.div>
      </section>
      
      {/* Why Seat Allocation Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Seat Allocation is Mandatory
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The SAC auditorium seats are university property. This system ensures every student is responsible for their allocated seat during movie screenings.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Seat Safety",
                description: "Prevent damage to auditorium seats by assigning clear responsibility to each student."
              },
              {
                icon: Users,
                title: "Accountability",
                description: "Every booking is linked to a student ID. Damage can be traced back to the assigned individual."
              },
              {
                icon: CheckCircle,
                title: "Discipline",
                description: "One student, one seat, one show. Maintain order and fairness for all attendees."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-8 border border-border shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How Accountability Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A simple 4-step process ensures transparency and responsibility.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Login", desc: "Sign in with your student credentials" },
              { step: "02", title: "Select Movie", desc: "Choose from available movie screenings" },
              { step: "03", title: "Pick Seat", desc: "Select ONE seat from the layout" },
              { step: "04", title: "Attend Show", desc: "Occupy only your allocated seat" }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-display font-bold text-primary/20 mb-4">{item.step}</div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Warning Section */}
      <section className="py-16 bg-destructive/5 border-y border-destructive/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-6 max-w-4xl mx-auto"
          >
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Important Notice
              </h3>
              <p className="text-muted-foreground">
                Any damage to your allocated seat will be traced back to you. Students are fully responsible for the condition of their assigned seat throughout the movie screening. Disciplinary action will be taken for any seat damage.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center gap-4 mb-6">
              <Film className="w-8 h-8 text-accent" />
              <Armchair className="w-8 h-8 text-accent" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready for the Next Show?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Book your seat now and enjoy the movie responsibly.
            </p>
            <Button asChild size="xl" variant="hero">
              <Link to="/student/login">
                Book Your Seat
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
