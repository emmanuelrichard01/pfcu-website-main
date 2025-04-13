
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  index: number;
}

const EventCard = ({ title, date, time, location, index }: EventCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        <div className="bg-pfcu-purple p-4 text-white flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">{title}</h3>
          <Calendar size={20} />
        </div>
        <CardContent className="p-6">
          <div className="space-y-2 mb-4">
            <p className="flex items-center">
              <span className="font-medium w-24">Date:</span> {date}
            </p>
            <p className="flex items-center">
              <span className="font-medium w-24">Time:</span> {time}
            </p>
            <p className="flex items-center">
              <span className="font-medium w-24">Location:</span> {location}
            </p>
          </div>
          <Link to={`/event/${index}`}>
            <Button variant="outline" className="w-full border-pfcu-purple text-pfcu-purple hover:bg-pfcu-purple hover:text-white">
              View Details
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const EventsSection = () => {
  const events = [
    {
      title: "Sunday Service",
      date: "Every Sunday",
      time: "9:00 AM - 12:00 PM",
      location: "Main Fellowship Hall",
    },
    {
      title: "Bible Study",
      date: "Every Wednesday",
      time: "6:00 PM - 8:00 PM",
      location: "Meeting Room 2",
    },
    {
      title: "Annual Retreat",
      date: "October 15-17, 2025",
      time: "All Day",
      location: "Caritas Retreat Center",
    },
  ];

  return (
    <section className="section-padding bg-pfcu-light" id="events">
      <div className="container">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Upcoming Events</h2>
          <p className="section-subtitle">Join us for fellowship and spiritual growth</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <EventCard key={event.title} {...event} index={index} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/events">
            <Button className="bg-pfcu-purple hover:bg-pfcu-dark text-white">
              View All Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
