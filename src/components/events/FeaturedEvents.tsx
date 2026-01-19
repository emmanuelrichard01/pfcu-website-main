
import FeaturedEventCard from "@/components/events/FeaturedEventCard";
import { Event } from "@/types/events";

interface FeaturedEventsProps {
  events: Event[];
  getEventIndex: (eventId: string) => number;
}

const FeaturedEvents = ({ events, getEventIndex }: FeaturedEventsProps) => {
  if (events.length === 0) return null;

  return (
    <section className="py-20 bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-12 text-center">
          <span className="text-pfcu-primary font-semibold tracking-wider uppercase mb-3">Don't Miss Out</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-zinc-900 dark:text-white">Featured Events</h2>
          <div className="mt-4 h-1 w-20 bg-pfcu-primary rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {events.map((event) => (
            <FeaturedEventCard
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
