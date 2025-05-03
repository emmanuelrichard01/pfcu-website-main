
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "Pentecostal Fellowship",
      subtitle: "of Caritas University",
      description: "Growing together in faith, purpose, and community since 2005.",
      cta: "Join Our Fellowship",
      secondaryCta: "Learn More"
    },
    {
      title: "Discover Your Purpose",
      subtitle: "Through Christ",
      description: "Find your spiritual gifts and grow in a supportive community of believers.",
      cta: "Attend an Event",
      secondaryCta: "View Sermons"
    },
    {
      title: "Many But One",
      subtitle: "in Christ Jesus",
      description: "United in faith, diverse in talents, serving one purpose in Christ Jesus.",
      cta: "Get Involved",
      secondaryCta: "Contact Us"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Particle animations
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10
  }));

  return (
    <div className="relative bg-pfcu-purple min-h-[80vh] flex items-center overflow-hidden">
      {/* Animated background particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute bg-white/10 rounded-full z-0"
          initial={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            opacity: 0.3,
            scale: 0.5
          }}
          animate={{
            x: [`${particle.x}%`, `${(particle.x + 10) % 100}%`],
            y: [`${particle.y}%`, `${(particle.y + 15) % 100}%`],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            width: particle.size,
            height: particle.size
          }}
        />
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-r from-pfcu-dark to-pfcu-purple opacity-95 z-0"></div>
      
      {/* Carousel content */}
      <div className="container relative z-10 text-white flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-4xl text-center"
          >
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {slides[currentSlide].title}{" "}
              <motion.span 
                className="text-pfcu-gold inline-block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                {slides[currentSlide].subtitle}
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-10 text-gray-100 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {slides[currentSlide].description}
            </motion.p>
            <motion.div 
              className="flex flex-wrap gap-5 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Button size="lg" className="bg-pfcu-gold hover:bg-yellow-500 text-pfcu-dark text-lg px-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                {slides[currentSlide].cta}
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 transition-all hover:-translate-y-1">
                {slides[currentSlide].secondaryCta}
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Carousel indicators */}
      <div className="absolute z-10 bottom-10 left-0 right-0 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? "w-8 bg-pfcu-gold" : "bg-white/50 hover:bg-white/80"
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Navigation buttons with hover effects */}
      <button 
        className="absolute left-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition-all hover:scale-110"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        className="absolute right-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition-all hover:scale-110"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full">
          <path 
            fill="white" 
            fillOpacity="1" 
            d="M0,64L48,64C96,64,192,64,288,53.3C384,43,480,21,576,21.3C672,21,768,43,864,48C960,53,1056,43,1152,42.7C1248,43,1344,53,1392,58.7L1440,64L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
