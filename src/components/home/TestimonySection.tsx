
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonyProps {
  text: string;
  name: string;
  role: string;
}

const TestimonyCard = ({ text, name, role }: TestimonyProps) => {
  return (
    <div className="h-full px-2 py-4">
      <div className="h-full bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 p-8 rounded-3xl shadow-sm relative flex flex-col justify-between">
        <Quote className="absolute top-8 right-8 text-pfcu-primary/20 w-12 h-12" />

        <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 font-light leading-relaxed mb-8 italic relative z-10">
          "{text}"
        </p>

        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-white dark:border-zinc-800 shadow-sm">
            <AvatarFallback className="bg-pfcu-primary/10 text-pfcu-primary font-bold">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-heading font-bold text-zinc-900 dark:text-white">{name}</h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonySection = () => {
  const testimonies = [
    {
      text: "PFCU has been my spiritual home away from home. Through the fellowship, I've grown in my faith and formed lifelong friendships that have supported me throughout my academic journey.",
      name: "Sarah Johnson",
      role: "4th Year Student",
    },
    {
      text: "Being part of the Choir Unit has helped me discover and develop my musical gifts while serving God. I'm grateful for the leadership opportunities and mentorship I've received at PFCU.",
      name: "Michael Okafor",
      role: "3rd Year Student",
    },
    {
      text: "The fellowship provided me with the spiritual foundation I needed during my university years. Now as an alumnus, I still cherish those moments and continue to apply the principles I learned.",
      name: "Grace Adebayo",
      role: "PFCU Alumni",
    },
    {
      text: "Service in the technical unit taught me discipline and excellence. It's more than just a fellowship; it's a training ground for life and leadership.",
      name: "David Okon",
      role: "Media Unit Head"
    }
  ];

  return (
    <section className="section-padding bg-zinc-50 dark:bg-zinc-950 py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />

      <div className="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-pfcu-primary font-bold tracking-widest uppercase text-xs mb-3 block">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-zinc-900 dark:text-white tracking-tight">
            Voices of our <span className="text-pfcu-primary">Family</span>
          </h2>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonies.map((testimony, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-[90%] md:basis-1/2 lg:basis-1/3">
                <TestimonyCard {...testimony} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-10">
            <CarouselPrevious className="static transform-none border-zinc-200 hover:bg-white hover:text-pfcu-primary" />
            <CarouselNext className="static transform-none border-zinc-200 hover:bg-white hover:text-pfcu-primary" />
          </div>
        </Carousel>
      </div>
    </section >
  );
};

export default TestimonySection;
