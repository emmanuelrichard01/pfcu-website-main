
import MainLayout from "@/components/layout/MainLayout";
import { useState } from "react";
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

interface EventProps {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: "Service" | "Bible Study" | "Prayer" | "Outreach" | "Social" | "Conference";
  isFeatured?: boolean;
}

const EventCard = ({ title, description, date, time, location, category, isFeatured, index }: EventProps & { index: number }) => {
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
  
  const events: EventProps[] = [
    {
      title: "Sunday Fellowship Service",
      description: "Join us for a spirit-filled time of worship, prayer, and the Word. All students are welcome!",
      date: "Every Sunday",
      time: "9:00 AM - 12:00 PM",
      location: "Main Fellowship Hall",
      category: "Service",
      isFeatured: true
    },
    {
      title: "Midweek Bible Study",
      description: "Deepen your understanding of the Word through interactive study and discussions.",
      date: "Every Wednesday",
      time: "6:00 PM - 8:00 PM",
      location: "Meeting Room 2",
      category: "Bible Study"
    },
    {
      title: "Prayer Rally",
      description: "A time of intense intercession for the campus, nation, and personal needs.",
      date: "Last Friday of Each Month",
      time: "10:00 PM - 1:00 AM",
      location: "Main Fellowship Hall",
      category: "Prayer"
    },
    {
      title: "Campus Outreach",
      description: "Join us as we share the love of Christ with fellow students through evangelism and acts of kindness.",
      date: "April 20, 2025",
      time: "2:00 PM - 5:00 PM",
      location: "Campus Quadrangle",
      category: "Outreach"
    },
    {
      title: "Fellowship Games Night",
      description: "A night of fun, games, and fellowship. Come network with other believers in a relaxed setting.",
      date: "April 25, 2025",
      time: "5:00 PM - 8:00 PM",
      location: "Student Union Building",
      category: "Social"
    },
    {
      title: "Annual PFCU Conference",
      description: "Our flagship event featuring powerful speakers, workshops, and impactful ministry sessions.",
      date: "October 15-17, 2025",
      time: "All Day",
      location: "Caritas Retreat Center",
      category: "Conference",
      isFeatured: true
    },
    {
      title: "Freshman Welcome Service",
      description: "Special service to welcome and integrate new students into the fellowship.",
      date: "September 10, 2025",
      time: "4:00 PM - 6:00 PM",
      location: "Main Fellowship Hall",
      category: "Service"
    },
    {
      title: "Academic Excellence Seminar",
      description: "Learn strategies for excelling in your studies while maintaining a vibrant spiritual life.",
      date: "May 5, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Lecture Hall 3",
      category: "Bible Study"
    }
  ];

  const filteredEvents = filter === "all" 
    ? events 
    : events.filter(event => event.category === filter);

  const featuredEvents = events.filter(event => event.isFeatured);

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

      {/* Featured Events Section */}
      {featuredEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-display font-bold mb-8 text-center">Featured Events</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredEvents.map((event, index) => (
                <EventCard 
                  key={index} 
                  {...event} 
                  index={events.findIndex(e => e.title === event.title)}
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
                  <SelectItem value="Service">Service</SelectItem>
                  <SelectItem value="Bible Study">Bible Study</SelectItem>
                  <SelectItem value="Prayer">Prayer</SelectItem>
                  <SelectItem value="Outreach">Outreach</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                  <SelectItem value="Conference">Conference</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <EventCard 
                key={index} 
                {...event} 
                index={events.findIndex(e => e.title === event.title)}
              />
            ))}
          </div>
          
          <div className="flex justify-center mt-12">
            <Button className="flex items-center space-x-2 bg-pfcu-purple hover:bg-pfcu-dark text-white">
              <CalIcon className="h-5 w-5" />
              <span>Add to Your Calendar</span>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Events;
