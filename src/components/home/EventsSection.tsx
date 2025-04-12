
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
}

const EventCard = ({ title, date, time, location }: EventCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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
        <Button variant="outline" className="w-full border-pfcu-purple text-pfcu-purple hover:bg-pfcu-purple hover:text-white">
          View Details
        </Button>
      </CardContent>
    </Card>
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
    <section className="section-padding bg-pfcu-light">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="section-title">Upcoming Events</h2>
          <p className="section-subtitle">Join us for fellowship and spiritual growth</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.title} {...event} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-pfcu-purple hover:bg-pfcu-dark text-white">
            View All Events
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
