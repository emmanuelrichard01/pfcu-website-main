
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/events";

interface EventCardProps {
  event: Event;
  index: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
  const { title, description, date, time, location, category, is_featured } = event;
  
  const categoryColors: Record<string, string> = {
    Service: "bg-blue-100 text-blue-800",
    "Bible Study": "bg-green-100 text-green-800",
    Prayer: "bg-purple-100 text-purple-800",
    Outreach: "bg-orange-100 text-orange-800",
    Social: "bg-pink-100 text-pink-800",
    Conference: "bg-yellow-100 text-yellow-800",
  };

  return (
    <Card 
      className={`overflow-hidden hover:shadow-lg transition-shadow ${
        is_featured ? 'relative' : ''
      }`}
    >
      {is_featured && (
        <>
          {/* Top distinctive border design for featured events */}
          <div className="h-2 bg-gradient-to-r from-pfcu-gold via-yellow-500 to-pfcu-gold" />
          <div className="bg-pfcu-gold text-white py-1 px-4 text-xs font-bold text-center">
            FEATURED EVENT
          </div>
        </>
      )}
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <Badge className={categoryColors[category] || "bg-gray-100 text-gray-800"}>{category}</Badge>
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
      </CardContent>
    </Card>
  );
};

export default EventCard;
