
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ArrowLeft, Calendar as CalIcon, Share2, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface EventData {
  title: string;
  description: string;
  fullDescription?: string;
  date: string;
  time: string;
  location: string;
  category: "Service" | "Bible Study" | "Prayer" | "Outreach" | "Social" | "Conference";
  isFeatured?: boolean;
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
}

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll use localStorage or hardcoded events
    const fetchEvent = () => {
      setLoading(true);
      const storedEvents = localStorage.getItem("pfcu_events");
      let events: EventData[] = [];
      
      if (storedEvents) {
        events = JSON.parse(storedEvents);
      } else {
        // Default events if none are stored
        events = [
          {
            title: "Sunday Fellowship Service",
            description: "Join us for a spirit-filled time of worship, prayer, and the Word. All students are welcome!",
            fullDescription: "Our Sunday service is the highlight of our week. We gather to worship God, hear His Word, and fellowship with one another. The service includes praise and worship, prayer, testimonies, and a sermon from our Pastor or guest speaker. Everyone is welcome to attend, regardless of background or faith.",
            date: "Every Sunday",
            time: "9:00 AM - 12:00 PM",
            location: "Main Fellowship Hall",
            category: "Service",
            organizer: "PFCU Worship Team",
            contactEmail: "worship@pfcu.org",
            contactPhone: "+234 801 234 5678",
            isFeatured: true
          },
          {
            title: "Midweek Bible Study",
            description: "Deepen your understanding of the Word through interactive study and discussions.",
            fullDescription: "Our midweek Bible study offers an opportunity to dive deeper into God's Word in a more intimate setting. We explore Scripture together, ask questions, and discuss how to apply biblical principles in our daily lives as students and young professionals.",
            date: "Every Wednesday",
            time: "6:00 PM - 8:00 PM",
            location: "Meeting Room 2",
            category: "Bible Study",
            organizer: "PFCU Teaching Unit",
            contactEmail: "teaching@pfcu.org",
            contactPhone: "+234 802 345 6789"
          },
          {
            title: "Annual PFCU Conference",
            description: "Our flagship event featuring powerful speakers, workshops, and impactful ministry sessions.",
            fullDescription: "The Annual PFCU Conference is our largest event of the year. It brings together current students, alumni, and guest ministers for three days of spiritual renewal, worship, and fellowship. The conference includes general sessions, workshops tailored to various interests, prayer sessions, and social activities to build relationships within the fellowship.",
            date: "October 15-17, 2025",
            time: "All Day",
            location: "Caritas Retreat Center",
            category: "Conference",
            organizer: "PFCU Executive Committee",
            contactEmail: "conference@pfcu.org",
            contactPhone: "+234 803 456 7890",
            isFeatured: true
          }
        ];
        localStorage.setItem("pfcu_events", JSON.stringify(events));
      }
      
      // Find the event by index since we're using index as ID in the URL
      const eventIndex = parseInt(id || "0");
      
      if (!isNaN(eventIndex) && eventIndex >= 0 && eventIndex < events.length) {
        setEvent(events[eventIndex]);
      } else {
        // Handle event not found
        navigate("/events");
        toast({
          title: "Event not found",
          description: "The requested event could not be found.",
          variant: "destructive"
        });
      }
      
      setLoading(false);
    };
    
    fetchEvent();
  }, [id, navigate, toast]);

  const categoryColors = {
    Service: "bg-blue-100 text-blue-800",
    "Bible Study": "bg-green-100 text-green-800",
    Prayer: "bg-purple-100 text-purple-800",
    Outreach: "bg-orange-100 text-orange-800",
    Social: "bg-pink-100 text-pink-800",
    Conference: "bg-yellow-100 text-yellow-800",
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      })
      .catch((error) => console.log("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "The event link has been copied to your clipboard."
      });
    }
  };

  const handleAddCalendar = () => {
    toast({
      title: "Calendar link generated",
      description: "The event has been added to your calendar (simulated)."
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-16 flex justify-center">
          <div className="animate-pulse flex flex-col w-full max-w-3xl">
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-40 bg-gray-200 rounded mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!event) return null;

  return (
    <MainLayout>
      <div className="bg-pfcu-light py-16">
        <div className="container mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6 flex items-center gap-2 text-pfcu-purple hover:text-pfcu-dark"
            onClick={() => navigate("/events")}
          >
            <ArrowLeft size={18} />
            <span>Back to all events</span>
          </Button>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {event.isFeatured && (
              <div className="bg-pfcu-gold text-white py-2 px-4 text-sm font-bold text-center">
                FEATURED EVENT
              </div>
            )}
            
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                  <Badge className={categoryColors[event.category]}>{event.category}</Badge>
                  <h1 className="text-3xl md:text-4xl font-display font-bold mt-2">{event.title}</h1>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={handleShare}
                  >
                    <Share2 size={16} />
                    <span>Share</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex items-center gap-1"
                  >
                    <Heart size={16} />
                    <span>Save</span>
                  </Button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="prose max-w-none">
                    <p className="text-lg mb-4">{event.description}</p>
                    <p className="mb-6">{event.fullDescription || "Join us for this special event. More details will be provided closer to the date."}</p>
                    
                    {event.organizer && (
                      <div className="mt-6">
                        <h3 className="text-xl font-display font-bold">Organizer</h3>
                        <p>{event.organizer}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8">
                    <Button
                      size="lg"
                      className="bg-pfcu-purple hover:bg-pfcu-dark text-white w-full md:w-auto"
                      onClick={handleAddCalendar}
                    >
                      <CalIcon className="mr-2 h-5 w-5" />
                      Add to Calendar
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-display font-bold text-xl mb-4">Event Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-3 text-pfcu-purple mt-1" />
                      <div>
                        <p className="font-bold">Date</p>
                        <p>{event.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 mr-3 text-pfcu-purple mt-1" />
                      <div>
                        <p className="font-bold">Time</p>
                        <p>{event.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 text-pfcu-purple mt-1" />
                      <div>
                        <p className="font-bold">Location</p>
                        <p>{event.location}</p>
                        <Button variant="link" className="p-0 h-auto text-pfcu-purple">
                          View on map
                        </Button>
                      </div>
                    </div>
                    
                    {(event.contactEmail || event.contactPhone) && (
                      <div className="border-t pt-4 mt-4">
                        <h4 className="font-bold mb-2">Contact Information</h4>
                        {event.contactEmail && <p>{event.contactEmail}</p>}
                        {event.contactPhone && <p>{event.contactPhone}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EventDetails;
