
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/events";
import EventCard from "@/components/events/EventCard";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const HomeEventCard = ({ title, date, time, location, index }: { title: string; date: string; time: string; location: string; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        <div className="bg-pfcu-purple p-4 text-white flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">{title}</h3>
          <Calendar size={20} />
        </div>
        <CardContent className="p-6">
          <div className="space-y-2 mb-4">
            <p className="flex items-center">
              <span className="font-medium w-24">Date:</span> {date}
            </p>
            <p className="flex items-center">
              <span className="font-medium w-24">Time:</span> {time}
            </p>
            <p className="flex items-center">
              <span className="font-medium w-24">Location:</span> {location}
            </p>
          </div>
          <Link to={`/event/${index}`}>
            <Button variant="outline" className="w-full border-pfcu-purple text-pfcu-purple hover:bg-pfcu-purple hover:text-white">
              View Details
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const EventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch featured events first, then add regular events up to 3 total
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('is_featured', { ascending: false })
          .limit(3);
        
        if (error) {
          throw error;
        }
        
        // Cast the data to ensure it matches the Event type
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
    <section className="section-padding bg-pfcu-light" id="events">
      <div className="container">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Upcoming Events</h2>
          <p className="section-subtitle">Join us for fellowship and spiritual growth</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pfcu-purple"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <HomeEventCard 
                key={event.id} 
                title={event.title} 
                date={event.date} 
                time={event.time} 
                location={event.location} 
                index={getEventIndex(event.id)} 
              />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/events">
            <Button className="bg-pfcu-purple hover:bg-pfcu-dark text-white">
              View All Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
