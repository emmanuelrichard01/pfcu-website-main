
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/events";
import EventsLoading from "@/components/events/EventsLoading";
import FeaturedEvents from "@/components/events/FeaturedEvents";
import EventsList from "@/components/events/EventsList";

const Events = () => {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('is_featured', { ascending: false })
          .order('date', { ascending: true }); // Secondary sort by date

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

  const featuredEvents = events.filter(event => event.is_featured);

  // Get list of unique categories from the events
  const categories = [...new Set(events.map(event => event.category))];

  return (
    <MainLayout>
      {/* Redesigned Hero Section */}
      {/* Redesigned Hero Section (Matching System Consistency) */}
      <div className="relative bg-pfcu-dark pt-32 pb-16 md:py-36 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-pfcu-primary/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-pfcu-secondary/10 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />
        </div>

        <div className="container relative mx-auto px-4 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-pfcu-secondary text-sm font-medium mb-6">
              <Calendar size={14} />
              <span>Community & Fellowship</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 tracking-tight">
              Upcoming <span className="text-pfcu-secondary">Events</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Join us for fellowship, spiritual growth, and community service. There is a place for everyone to belong.
            </p>
          </motion.div>
        </div>
      </div>

      {loading ? (
        <EventsLoading />
      ) : (
        <>
          {/* Featured Events Section */}
          <FeaturedEvents
            events={featuredEvents}
            getEventIndex={getEventIndex}
          />

          {/* All Events Section */}
          <EventsList
            events={events}
            filter={filter}
            setFilter={setFilter}
            categories={categories}
            getEventIndex={getEventIndex}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </>
      )}
    </MainLayout>
  );
};

export default Events;
