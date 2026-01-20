
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/events";
import { ArrowLeft, ArrowRight, Calendar, MapPin } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";

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
    <section className="section-padding bg-gradient-to-b from-gray-50 to-white overflow-hidden py-24 md:py-32" id="events">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-pfcu-secondary/10 text-pfcu-primary text-sm font-semibold tracking-wide mb-4">
              COMMUNITY CALENDAR
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 tracking-tight">Upcoming <span className="text-pfcu-primary">Events</span></h2>
            <p className="text-lg text-muted-foreground max-w-lg">
              Join us for worship, fellowship, and special programs designed to help you grow in faith.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="hidden md:block"
          >
            <Button variant="outline" className="border-pfcu-primary text-pfcu-primary hover:bg-pfcu-primary hover:text-white rounded-full px-6 h-12" asChild>
              <Link to="/events">
                View Full Calendar <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pfcu-primary"></div>
          </div>
        ) : (
          <div className="relative">
            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-pfcu-secondary/5 rounded-full blur-[100px] -z-10" />
            <div className="absolute -bottom-20 right-0 w-80 h-80 bg-pfcu-primary/5 rounded-full blur-[80px] -z-10" />

            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4 pb-12">
                {events.length > 0 ? (
                  events.map((event, index) => (
                    <CarouselItem key={event.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group relative h-full bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        {/* Image */}
                        <div className="aspect-[4/3] overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                          <img
                            src={event.image_url || `https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop`}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          {/* Date Badge */}
                          <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur shadow-lg rounded-2xl p-3 text-center min-w-[70px]">
                            <span className="block text-xs font-semibold text-muted-foreground uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                            <span className="block text-2xl font-bold text-pfcu-primary leading-none mt-0.5">{new Date(event.date).getDate()}</span>
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="text-xl font-bold font-heading mb-2 group-hover:text-pfcu-primary transition-colors line-clamp-1" title={event.title}>{event.title}</h3>

                          <div className="space-y-2 mb-6">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4 mr-2 text-pfcu-secondary" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4 mr-2 text-pfcu-secondary" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          </div>

                          <Button variant="ghost" className="w-full justify-between group/btn hover:bg-pfcu-primary/5 hover:text-pfcu-primary" asChild>
                            <Link to={`/event/${event.id}`}>
                              Details
                              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                          </Button>
                        </div>
                      </motion.div>
                    </CarouselItem>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center w-full">
                    <p className="text-lg text-muted-foreground">No upcoming events scheduled at the moment.</p>
                  </div>
                )}
              </CarouselContent>
              <div className="flex justify-end gap-2 mt-4 pr-1">
                <CarouselPrevious className="static transform-none" />
                <CarouselNext className="static transform-none" />
              </div>
            </Carousel>
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" className="border-pfcu-primary text-pfcu-primary rounded-full px-8" asChild>
            <Link to="/events">
              View Full Calendar
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
