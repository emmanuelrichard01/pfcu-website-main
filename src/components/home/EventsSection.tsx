
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/events";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import HomeEventCard from "./HomeEventCard";

// Removed inline HomeEventCard component

const EventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('is_featured', { ascending: false })
          .limit(3);

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

  const getEventIndex = (eventId: string): number => {
    return events.findIndex(e => e.id === eventId);
  };

  return (
    <section className="section-padding bg-muted/50" id="events">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="text-pfcu-primary font-semibold tracking-wider uppercase mb-2 block">Calendar</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Upcoming Events</h2>
            <p className="text-lg text-muted-foreground">Don't miss out on what God is doing in our midst. Join us for fellowship, worship, and spiritual growth.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link to="/events">
              <Button variant="outline" className="border-pfcu-primary text-pfcu-primary hover:bg-pfcu-primary hover:text-white rounded-full px-6">
                View Full Calendar
              </Button>
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pfcu-primary"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <HomeEventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                time={event.time}
                location={event.location}
                index={index} // Keep index for animation delay
                image_url={event.image_url}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
