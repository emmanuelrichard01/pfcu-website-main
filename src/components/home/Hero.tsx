
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

  return (
    <div className="relative bg-pfcu-purple min-h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-pfcu-dark to-pfcu-purple opacity-90"></div>
      
      {/* Carousel content - Now center-aligned */}
      <div className="container relative z-10 text-white flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-2">
              {slides[currentSlide].title} <span className="text-pfcu-gold">{slides[currentSlide].subtitle}</span>
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              {slides[currentSlide].description}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-pfcu-gold hover:bg-yellow-600 text-pfcu-dark">
                {slides[currentSlide].cta}
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                {slides[currentSlide].secondaryCta}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Carousel controls */}
      <div className="absolute z-10 bottom-8 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? "bg-pfcu-gold" : "bg-white/50"
            } transition-all`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft />
      </button>
      <button 
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default Hero;
