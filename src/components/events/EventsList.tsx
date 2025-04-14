
import { Calendar as CalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/events/EventCard";
import EventFilter from "@/components/events/EventFilter";
import { Event } from "@/types/events";

interface EventsListProps {
  events: Event[];
  filter: string;
  setFilter: (filter: string) => void;
  categories: string[];
  getEventIndex: (eventId: string) => number;
}

const EventsList = ({ events, filter, setFilter, categories, getEventIndex }: EventsListProps) => {
  const filteredEvents = filter === "all" 
    ? events 
    : events.filter(event => event.category === filter);

  return (
    <section className="py-16 bg-pfcu-light">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-display font-bold">All Upcoming Events</h2>
          
          <EventFilter
            categories={categories}
            selectedCategory={filter}
            onCategoryChange={setFilter}
          />
        </div>
        
        {filteredEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                index={getEventIndex(event.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg text-center">
            <CalIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">No events found</h3>
            <p className="text-gray-600">There are no events in this category at the moment. Check back soon!</p>
          </div>
        )}
        
        <div className="flex justify-center mt-12">
          <Button className="flex items-center space-x-2 bg-pfcu-purple hover:bg-pfcu-dark text-white">
            <CalIcon className="h-5 w-5" />
            <span>Add to Your Calendar</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsList;
