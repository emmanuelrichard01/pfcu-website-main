
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/events";
import EventsLoading from "@/components/events/EventsLoading";
import FeaturedEvents from "@/components/events/FeaturedEvents";
import EventsList from "@/components/events/EventsList";

const Events = () => {
  const [filter, setFilter] = useState<string>("all");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('is_featured', { ascending: false });
        
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
      <div className="bg-pfcu-light py-16 md:py-24">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-center mb-6">Upcoming Events</h1>
          <p className="text-xl text-center max-w-3xl mx-auto text-gray-700">
            Join us for fellowship, spiritual growth, and community service.
          </p>
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
          />
        </>
      )}
    </MainLayout>
  );
};

export default Events;
