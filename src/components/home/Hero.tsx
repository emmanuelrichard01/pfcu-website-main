
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";

const Hero = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const plugin = useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false })
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrentSlide(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  const slides = [
    {
      id: 1,
      title: "Loving Community",
      subtitle: "Growing Together",
      description: "A community defined by faith, purpose, and academic excellence. Growing together in Christ since 2005.",
      cta: "Join Our Fellowship",
      link: "/about",
      image: "photo-1523580494863-6f3031224c94"
    },
    {
      id: 2,
      title: "Discover Purpose",
      subtitle: "Serve with Passion",
      description: "Uncover your spiritual gifts and find your place in God's kingdom through our 9 specialized departments.",
      cta: "Find a Department",
      link: "/departments",
      image: "photo-1544427920-c49ccfb85579"
    },
    {
      id: 3,
      title: "Join the Family",
      subtitle: "Weekly Fellowship",
      description: "Experience the warmth of true Christian community. We meet every Wednesday and Sunday.",
      cta: "Plan a Visit",
      link: "/contact",
      image: "photo-1511632765486-a01980e01a18"
    }
  ];

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-pfcu-dark">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        setApi={setApi}
      >
        <CarouselContent className="h-full ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="h-full pl-0 relative">
              {/* Background Image */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-t from-pfcu-dark via-pfcu-dark/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-black/30 z-10" />
                <img
                  src={`https://images.unsplash.com/${slide.image}?auto=format&fit=crop&q=80&w=2000`}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="container relative z-20 pt-40 md:pt-50 h-full flex flex-col justify-center">
                <div className="max-w-4xl mx-auto text-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide} // Key change ensures animation re-runs
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
                      {/* Subtitle Badge */}
                      <motion.div variants={textVariants} className="mb-8 flex justify-center">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs md:text-sm font-medium text-white tracking-widest uppercase shadow-sm">
                          {slide.subtitle}
                        </span>
                      </motion.div>

                      {/* Title */}
                      <motion.h1
                        variants={textVariants}
                        className="font-heading font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1] mb-6 text-white drop-shadow-sm"
                      >
                        {slide.title}
                      </motion.h1>

                      {/* Description */}
                      <motion.p
                        variants={textVariants}
                        className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto mb-10 font-light leading-relaxed drop-shadow-sm"
                      >
                        {slide.description}
                      </motion.p>

                      {/* Buttons */}
                      <motion.div
                        variants={textVariants}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                      >
                        <Link to={slide.link}>
                          <Button
                            size="lg"
                            className="h-14 px-8 rounded-full bg-pfcu-primary hover:bg-pfcu-primary/90 text-white font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-xl shadow-pfcu-primary/25"
                          >
                            {slide.cta}
                          </Button>
                        </Link>

                        <Link to="/sermons">
                          <Button
                            variant="outline"
                            size="lg"
                            className="h-14 px-8 rounded-full border-white/30 bg-white/5 backdrop-blur-sm text-white hover:bg-white hover:text-pfcu-primary font-semibold text-lg hover:scale-105 transition-all duration-300"
                          >
                            Latest Sermon
                          </Button>
                        </Link>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom Navigation */}
        <div className="absolute bottom-10 right-10 z-30 flex gap-2 invisible md:visible">
          <CarouselPrevious className="relative inset-auto bg-black/20 hover:bg-pfcu-primary border-white/10 text-white h-12 w-12" />
          <CarouselNext className="relative inset-auto bg-black/20 hover:bg-pfcu-primary border-white/10 text-white h-12 w-12" />
        </div>
      </Carousel>
    </section>
  );
};

export default Hero;
