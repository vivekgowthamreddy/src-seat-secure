import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Users, CheckCircle, AlertTriangle, ArrowRight, Film, Armchair, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import heroImage from "@/assets/sac-auditorium-real.webp";
import { TOTAL_SEATS } from "@/data/seatLayout";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header variant="landing" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Premium Overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="SAC Auditorium"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-hero-gradient opacity-95" />
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 pt-24 pb-16">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8"
            >
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-white/90 tracking-wide">Official SRC Platform</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-8 leading-[1.1] tracking-tight"
            >
              SAC Movie Seat
              <br />
              <span className="text-accent">Accountability</span> System
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed font-light"
            >
              Ensuring seat safety, discipline, and accountability during SAC movie screenings.
              A digital platform by the Student Recreation Club, RGUKT Nuzvid.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-base font-medium rounded-full">
                <Link to="/student/login">
                  Student Login
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base font-medium rounded-full">
                <Link to="/admin/login">
                  Admin Access
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="mt-20 grid grid-cols-3 gap-12 max-w-md mx-auto"
            >
              {[
                { value: TOTAL_SEATS, label: "Total Seats" },
                { value: "18", label: "Rows" },
                { value: "1", label: "Seat Per Student" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl md:text-5xl font-display font-semibold text-white">{stat.value}</div>
                  <div className="text-sm text-white/50 mt-2 tracking-wide">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="w-5 h-9 border border-white/30 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="w-1 h-1 bg-white/60 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Why Seat Allocation Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-accent text-sm font-medium tracking-widest uppercase mb-4 block">Purpose</span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-6">
              Why Seat Allocation is Mandatory
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              The SAC auditorium seats are university property. This system ensures every student is responsible for their allocated seat during movie screenings.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group bg-card rounded-2xl p-8 border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/15 transition-colors">
                  <feature.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-accent text-sm font-medium tracking-widest uppercase mb-4 block">Process</span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-6">
              How Accountability Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A simple 4-step process ensures transparency and responsibility.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Login", desc: "Sign in with your student credentials" },
              { step: "02", title: "Select Movie", desc: "Choose from available movie screenings" },
              { step: "03", title: "Pick Seat", desc: "Select ONE seat from the layout" },
              { step: "04", title: "Attend Show", desc: "Occupy only your allocated seat" }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center relative"
              >
                <div className="text-7xl font-display font-bold text-border mb-4">{item.step}</div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-px bg-border" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Warning Section */}
      <section className="py-16 bg-destructive/5 border-y border-destructive/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto"
          >
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
                Important Notice
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Any damage to your allocated seat will be traced back to you. Students are fully responsible for the condition of their assigned seat throughout the movie screening. Disciplinary action will be taken for any seat damage.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-neutral-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center gap-6 mb-8">
              <Film className="w-10 h-10 text-white/50" />
              <Armchair className="w-10 h-10 text-white/50" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-6">
              Ready for the Next Show?
            </h2>
            <p className="text-white/60 mb-10 max-w-xl mx-auto text-lg">
              Book your seat now and enjoy the movie responsibly.
            </p>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-10 py-6 text-base font-medium rounded-full">
              <Link to="/student/login">
                Book Your Seat
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 bg-background border-t border-border" id="about">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-accent text-sm font-medium tracking-widest uppercase mb-4 block">About Us</span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-6">
              Meet the Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              The dedicated individuals behind the Student Recreation Club and the Seat Accountability System.
            </p>
          </motion.div>

          {/* Team SRC */}
          <div className="mb-24">
            <h3 className="font-display text-2xl font-semibold text-foreground mb-12 text-center">Team SRC</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[1, 2, 3, 4, 5, 6].map((member) => (
                <div key={member} className="text-center group">
                  <div className="w-full aspect-[3/4] bg-muted rounded-2xl mb-4 overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-300">
                    {/* Placeholder for size 6 team member photo */}
                    <div className="absolute inset-0 bg-accent/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                      <Users className="w-10 h-10 text-muted-foreground/30 group-hover:text-accent/50 transition-colors" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-foreground text-sm">SRC Member {member}</h4>
                  <p className="text-xs text-muted-foreground mt-1">Core Team</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Team */}
          <div className="max-w-4xl mx-auto mb-24">
            <h3 className="font-display text-2xl font-semibold text-foreground mb-12 text-center">Technical & Development Team</h3>
            <div className="grid md:grid-cols-2 gap-12 text-center">
              {/* Vivek */}
              <div className="text-center group">
                <div className="w-48 h-48 mx-auto bg-muted rounded-full mb-6 overflow-hidden relative ring-4 ring-offset-4 ring-offset-background ring-border group-hover:ring-accent transition-all duration-300 grayscale group-hover:grayscale-0">
                  <div className="absolute inset-0 bg-accent/5 flex items-center justify-center">
                    <Users className="w-16 h-16 text-muted-foreground/40 group-hover:text-accent transition-colors" />
                  </div>
                </div>
                <h4 className="text-2xl font-semibold text-foreground">Vivek</h4>
                <p className="text-accent font-medium mt-1">Lead Developer</p>
              </div>
              {/* Lokesh */}
              <div className="text-center group">
                <div className="w-48 h-48 mx-auto bg-muted rounded-full mb-6 overflow-hidden relative ring-4 ring-offset-4 ring-offset-background ring-border group-hover:ring-accent transition-all duration-300 grayscale group-hover:grayscale-0">
                  <div className="absolute inset-0 bg-accent/5 flex items-center justify-center">
                    <Users className="w-16 h-16 text-muted-foreground/40 group-hover:text-accent transition-colors" />
                  </div>
                </div>
                <h4 className="text-2xl font-semibold text-foreground">Lokesh</h4>
                <p className="text-accent font-medium mt-1">Lead Developer</p>
              </div>
            </div>
          </div>

          {/* Contact Us */}
          <div className="max-w-2xl mx-auto text-center bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-[100px]" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-tr-[80px]" />
            <h3 className="font-display text-2xl font-semibold text-foreground mb-4 relative z-10">Contact Us</h3>
            <p className="text-muted-foreground mb-8 relative z-10">
              For queries related to bookings, seat allocation, or technical support, please reach out to us.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative z-10">
              <a href="mailto:src@rguktn.ac.in" className="flex items-center gap-3 text-foreground hover:text-accent transition-colors px-8 py-4 bg-background rounded-full border border-border hover:border-accent hover:shadow-md group">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="font-medium">src@rguktn.ac.in</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
