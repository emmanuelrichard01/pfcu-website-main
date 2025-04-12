
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative bg-pfcu-purple min-h-[600px] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-r from-pfcu-dark to-pfcu-purple opacity-90"></div>
      <div className="container relative z-10 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
            Pentecostal Fellowship <span className="text-pfcu-gold">of Caritas University</span>
          </h1>
          <p className="text-xl mb-8 text-gray-200">
            Growing together in faith, purpose, and community since 2005.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-pfcu-gold hover:bg-yellow-600 text-pfcu-dark">
              Join Our Fellowship
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
