
import EventCard from "@/components/events/EventCard";
import { Event } from "@/types/events";

interface FeaturedEventsProps {
  events: Event[];
  getEventIndex: (eventId: string) => number;
}

const FeaturedEvents = ({ events, getEventIndex }: FeaturedEventsProps) => {
  if (events.length === 0) return null;
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-display font-bold mb-8 text-center">Featured Events</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              index={getEventIndex(event.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
