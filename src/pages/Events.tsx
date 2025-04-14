
import MainLayout from "@/components/layout/MainLayout";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Filter, Calendar as CalIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/events";

const EventCard = ({ title, description, date, time, location, category, isFeatured, index }: Event & { index: number }) => {
  const categoryColors = {
    Service: "bg-blue-100 text-blue-800",
    "Bible Study": "bg-green-100 text-green-800",
    Prayer: "bg-purple-100 text-purple-800",
    Outreach: "bg-orange-100 text-orange-800",
    Social: "bg-pink-100 text-pink-800",
    Conference: "bg-yellow-100 text-yellow-800",
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${isFeatured ? 'border-pfcu-gold border-2' : ''}`}>
      <CardContent className="p-0">
        {isFeatured && (
          <div className="bg-pfcu-gold text-white py-1 px-4 text-xs font-bold text-center">
            FEATURED EVENT
          </div>
        )}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold">{title}</h3>
            <Badge className={categoryColors[category]}>{category}</Badge>
          </div>
          
          <p className="mb-4 text-gray-700">{description}</p>
          
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{date}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>{time}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{location}</span>
            </div>
          </div>
          
          <div className="mt-6">
            <Link to={`/event/${index}`}>
              <Button className="w-full bg-pfcu-purple hover:bg-pfcu-dark text-white">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

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
        
        setEvents(data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = filter === "all" 
    ? events 
    : events.filter(event => event.category === filter);

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
        <div className="py-16 bg-white">
          <div className="container mx-auto flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pfcu-purple"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Featured Events Section */}
          {featuredEvents.length > 0 && (
            <section className="py-16 bg-white">
              <div className="container mx-auto">
                <h2 className="text-3xl font-display font-bold mb-8 text-center">Featured Events</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {featuredEvents.map((event, index) => (
                    <EventCard 
                      key={event.id} 
                      {...event} 
                      index={events.findIndex(e => e.id === event.id)}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* All Events Section */}
          <section className="py-16 bg-pfcu-light">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h2 className="text-3xl font-display font-bold">All Upcoming Events</h2>
                
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                  <Filter className="h-5 w-5 text-pfcu-purple" />
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {filteredEvents.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event, index) => (
                    <EventCard 
                      key={event.id} 
                      {...event} 
                      index={events.findIndex(e => e.id === event.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg text-center">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
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
        </>
      )}
    </MainLayout>
  );
};

export default Events;
