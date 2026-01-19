
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
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const EventsList = ({
  events,
  filter,
  setFilter,
  categories,
  getEventIndex,
  searchQuery,
  setSearchQuery
}: EventsListProps) => {
  const filteredEvents = events.filter(event => {
    const matchesCategory = filter === "all" || event.category === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-16 bg-zinc-50 dark:bg-zinc-950/50">
      <div className="container mx-auto">
        <div className="flex flex-col mb-12">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-display font-bold text-zinc-900 dark:text-zinc-100">All Upcoming Events</h2>
          </div>

          <EventFilter
            categories={categories}
            selectedCategory={filter}
            onCategoryChange={setFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
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
          <div className="bg-white dark:bg-card border border-dashed border-zinc-300 dark:border-zinc-700 p-12 rounded-lg text-center max-w-2xl mx-auto">
            <CalIcon className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">No events found</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              We couldn't find any events matching your criteria. Try adjusting your filters or check back later.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => {
                setFilter("all");
                setSearchQuery("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        <div className="flex justify-center mt-16">
          <Button className="flex items-center space-x-2 bg-pfcu-primary hover:bg-pfcu-primary/90 text-white rounded-full px-8 py-6 h-auto shadow-lg shadow-pfcu-primary/20 transition-all hover:scale-105">
            <CalIcon className="h-5 w-5" />
            <span>Subscribe to Calendar</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsList;
