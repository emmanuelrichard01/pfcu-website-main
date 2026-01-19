
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      id: 1,
      title: "Loving Community",
      subtitle: "Growing Together",
      description: "A community defined by faith, purpose, and academic excellence. Growing together in Christ since 2005.",
      cta: "Join Our Fellowship",
      link: "/about"
    },
    {
      id: 2,
      title: "Discover Purpose",
      subtitle: "Serve with Passion",
      description: "Uncover your spiritual gifts and find your place in God's kingdom through our 16 specialized ministry units.",
      cta: "Find a Unit",
      link: "/units"
    },
    {
      id: 3,
      title: "One Body",
      subtitle: "Many Members",
      description: "United in faith, diverse in talents, serving one purpose. Experience the power of unity in diversity.",
      cta: "View Events",
      link: "/events"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <div className="relative h-[95vh] flex items-center overflow-hidden bg-pfcu-dark text-white">
      {/* Sophisticated Static Background */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        {/* Subtle Radial Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-pfcu-dark to-pfcu-dark" />
        <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-pfcu-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-pfcu-secondary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

        {/* Fine Grain Texture */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
      </div>

      <div className="container relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { staggerChildren: 0.15, delayChildren: 0.1 }
                },
                exit: {
                  opacity: 0,
                  y: -10,
                  transition: { duration: 0.4 }
                }
              }}
            >
              {/* Badge */}
              <motion.div variants={textVariants} className="mb-8 flex justify-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs md:text-sm font-medium text-pfcu-secondary tracking-wider uppercase">
                  Welcome to PFCU
                </span>
              </motion.div>

              {/* Typography */}
              <motion.h1
                variants={textVariants}
                className="font-heading font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1] mb-8"
              >
                <span className="block text-white">{slides[currentSlide].title}</span>
                <span className="block text-white/50">{slides[currentSlide].subtitle}</span>
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={textVariants}
                className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
              >
                {slides[currentSlide].description}
              </motion.p>

              {/* Actions */}
              <motion.div
                variants={textVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Button
                  asChild
                  size="lg"
                  className="rounded-full h-14 px-8 text-lg bg-white text-pfcu-dark hover:bg-gray-100 font-semibold transition-all hover:scale-105 min-w-[180px]"
                >
                  <Link to={slides[currentSlide].link}>
                    {slides[currentSlide].cta} <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full h-14 px-8 text-lg border-white/20 text-white bg-transparent hover:bg-white/5 transition-all min-w-[180px]"
                >
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                    <Play className="mr-2 w-4 h-4 fill-current" /> Watch Video
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Slide Indicators */}
          <div className="mt-20 flex justify-center gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1 rounded-full transition-all duration-500 ${currentSlide === index ? "w-12 bg-pfcu-secondary" : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
