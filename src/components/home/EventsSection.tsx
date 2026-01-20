
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/events";
import { ArrowRight, Calendar, MapPin, Clock } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const EventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true })
          .gte('date', new Date().toISOString())
          .limit(6);

        if (error) throw error;
        setEvents(data as Event[]);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="py-16 md:py-32 bg-white dark:bg-zinc-950/50 overflow-hidden" id="events">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8 text-left relative z-10">
          <div className="max-w-2xl">
            <span className="text-pfcu-primary font-bold tracking-widest uppercase text-xs mb-3 block">
              Mark Your Calendars
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-zinc-900 dark:text-white">
              Upcoming <span className="text-pfcu-primary">Gatherings</span>
            </h2>
          </div>

          <div className="hidden md:block">
            <Button variant="link" className="text-zinc-900 dark:text-white hover:text-pfcu-primary p-0 h-auto font-semibold text-base group" asChild>
              <Link to="/events">
                View Full Calendar <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pfcu-primary"></div>
          </div>
        ) : (
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: events.length > 3,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-6">
                {events.length > 0 ? (
                  events.map((event) => (
                    <CarouselItem key={event.id} className="pl-6 basis-[85%] md:basis-1/2 lg:basis-1/3">
                      <Link to={`/event/${event.id}`} className="block h-full group">
                        <article className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">

                          {/* Image Container */}
                          <div className="aspect-video relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                            <img
                              src={event.image_url || `https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop`}
                              alt={event.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Date Badge */}
                            <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md shadow-sm rounded-xl px-3 py-2 text-center min-w-[60px]">
                              <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                              <span className="block text-xl font-bold text-zinc-900 leading-none">{new Date(event.date).getDate()}</span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold font-heading text-zinc-900 dark:text-white mb-3 line-clamp-2 group-hover:text-pfcu-primary transition-colors">
                              {event.title}
                            </h3>

                            <div className="space-y-3 mb-6 flex-grow">
                              <div className="flex items-center text-sm text-zinc-500">
                                <Clock className="w-4 h-4 mr-2.5 text-pfcu-primary/70" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center text-sm text-zinc-500">
                                <MapPin className="w-4 h-4 mr-2.5 text-pfcu-primary/70" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center text-sm font-semibold text-pfcu-primary">
                              Details <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </div>
                          </div>
                        </article>
                      </Link>
                    </CarouselItem>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center w-full">
                    <p className="text-zinc-500">No upcoming events scheduled.</p>
                  </div>
                )}
              </CarouselContent>

              <div className="flex justify-end gap-3 mt-8">
                <CarouselPrevious className="static transform-none border-zinc-200 hover:bg-zinc-100 hover:text-pfcu-primary" />
                <CarouselNext className="static transform-none border-zinc-200 hover:bg-zinc-100 hover:text-pfcu-primary" />
              </div>
            </Carousel>
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link to="/events" className="text-sm font-semibold text-pfcu-primary hover:underline">View Full Calendar</Link>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
