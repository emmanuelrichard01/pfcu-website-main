
import { Card, CardContent } from "@/components/ui/card";
import {
  Church,
  BookOpen,
  Users,
  Music,
  Palette,
  Shield,
  Baby,
  Video,
  HandHeart,
  ArrowRight,
  Megaphone,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface UnitCardProps {
  name: string;
  description: string;
  icon: React.ElementType;
}

const UnitCard = ({ name, description, icon: Icon }: UnitCardProps) => {
  return (
    <div className="h-full p-2">
      <Card className="h-full bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-pfcu-primary/20 transition-all duration-300 rounded-3xl overflow-hidden group relative cursor-pointer">
        <CardContent className="p-8 h-full flex flex-col items-start relative z-10 min-h-[320px]">
          {/* Icon Container */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-pfcu-primary/10 rounded-2xl transform rotate-3 transition-transform group-hover:rotate-6"></div>
            <div className="relative w-14 h-14 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl flex items-center justify-center text-pfcu-primary shadow-sm group-hover:text-pfcu-secondary transition-colors">
              <Icon size={26} strokeWidth={1.5} />
            </div>
          </div>

          <h3 className="font-heading text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100 leading-tight group-hover:text-pfcu-primary transition-colors">
            {name}
          </h3>

          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed flex-grow mb-6 line-clamp-4">
            {description}
          </p>

          <div className="w-full pt-4 mt-auto border-t border-zinc-100 dark:border-zinc-800">
            <span className="flex items-center text-xs font-semibold uppercase tracking-wider text-pfcu-primary group-hover:translate-x-1 transition-transform">
              Learn More
              <ArrowRight size={14} className="ml-2" />
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const UnitsSection = () => {
  const units = [
    {
      name: "Christian Education",
      description: "Dedicated to spiritual growth through systematic biblical teaching and academic excellence.",
      icon: BookOpen
    },
    {
      name: "Chaplaincy",
      description: "Ensures smooth services through orderliness, protocol, and sanctuary maintenance.",
      icon: Church
    },
    {
      name: "Beautification",
      description: "Creating an atmosphere conducive for worship through aesthetic excellence and design.",
      icon: Palette
    },
    {
      name: "Media & Communications",
      description: "The voice and image of the fellowship, managing internal and external communications.",
      icon: Megaphone
    },
    {
      name: "Creative Arts",
      description: "Expressing the gospel through drama, dance, spoken word, and creative ministrations.",
      icon: Sparkles
    },
    {
      name: "Intercessory",
      description: "The spiritual powerhouse standing in the gap through fervent prayer and intercession.",
      icon: Shield
    },
    {
      name: "Outreach & Care",
      description: "Extending Christ's love to the community and caring for members' welfare.",
      icon: HandHeart
    },
    {
      name: "PFCU Little Angel’s",
      description: "Nurturing the next generation of children in the way of the Lord.",
      icon: Baby
    },
    {
      name: "Worship",
      description: "Leading the fellowship in spirit-filled worship and managing technical production.",
      icon: Music
    }
  ];

  return (
    <section className="section-padding bg-zinc-50/50 dark:bg-zinc-950/50 relative overflow-hidden py-16 md:py-32 border-t border-zinc-100 dark:border-zinc-900">

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 md:mb-16 gap-4 md:gap-8 text-left">
          <div className="max-w-2xl">
            <span className="text-pfcu-primary font-bold tracking-widest uppercase text-xs mb-3 block">
              Our Ministries
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-zinc-900 dark:text-white">
              Serve in the <span className="text-pfcu-primary">Vineyard</span>
            </h2>
          </div>

          <div className="hidden md:block">
            <Link
              to="/departments"
              className="group inline-flex items-center text-sm font-semibold text-zinc-900 dark:text-white hover:text-pfcu-primary transition-colors"
            >
              View Full Directory
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Carousel Area */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-1">
            {units.map((unit) => (
              <CarouselItem key={unit.name} className="pl-4 md:pl-1 basis-[85%] md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <Link to="/departments">
                  <UnitCard {...unit} />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="left-0 -translate-x-1/2" />
            <CarouselNext className="right-0 translate-x-1/2" />
          </div>
        </Carousel>

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/departments"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white transition-all duration-300 bg-zinc-900 rounded-full hover:bg-pfcu-primary shadow-lg"
          >
            View All Departments
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UnitsSection;
