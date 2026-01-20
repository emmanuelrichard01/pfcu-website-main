
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] md:min-h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-950 pt-16 md:pt-20">

      {/* --- Alive Background --- */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <img
            src="/images/about-community.jpg"
            alt="PFCU Community"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/60 to-zinc-950" />
      </div>

      {/* --- Ambient Effects --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
        {/* Main purple/primary glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-pfcu-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse-slow" />

        {/* Secondary bluish glow */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen opacity-40" />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] bg-center" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 shadow-2xl shadow-pfcu-primary/10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pfcu-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pfcu-primary"></span>
            </span>
            <span className="text-xs md:text-sm font-medium text-zinc-300 tracking-widest uppercase">
              Welcome to PFCU
            </span>
          </motion.div>

          {/* Main Heading */}
          <h1 className="max-w-6xl mx-auto font-heading font-bold text-6xl sm:text-6xl md:text-8xl lg:text-9xl tracking-tighter text-white mb-6 md:mb-8 leading-[0.9] drop-shadow-2xl px-2">
            <span className="block mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Pentecostal
            </span>
            <span className="block text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white/40 font-serif italic">
              Fellowship
            </span>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="max-w-2xl mx-auto text-base md:text-xl text-zinc-300 font-light leading-relaxed mb-8 md:mb-12 drop-shadow-lg px-4"
          >
            A community defined by faith, purpose, and academic excellence.
            <br className="hidden md:block" />
            Growing together in Christ at Caritas University.
          </motion.p>

          {/* CTA Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link to="/departments" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-12 sm:h-14 px-6 sm:px-10 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-base sm:text-lg hover:scale-105 transition-transform duration-300 shadow-xl shadow-white/10">
                Join a Unit
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link to="/sermons" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full h-12 sm:h-14 px-6 sm:px-10 rounded-full border-white/30 bg-black/40 text-white hover:bg-white hover:text-pfcu-primary hover:border-white font-medium text-base sm:text-lg backdrop-blur-sm transition-all duration-300 group">
                <PlayCircle className="mr-2 w-5 h-5 text-white/80 group-hover:text-pfcu-primary transition-colors" />
                Latest Message
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
