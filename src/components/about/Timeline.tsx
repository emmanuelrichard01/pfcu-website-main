
import { Badge } from "@/components/ui/badge";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline = ({ events }: TimelineProps) => {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-pfcu-purple/20"></div>
      
      <div className="space-y-12">
        {events.map((event, index) => (
          <div 
            key={event.year} 
            className={`relative flex flex-col md:flex-row ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            {/* Timeline dot */}
            <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-pfcu-purple z-10"></div>
            
            {/* Content */}
            <div className="pl-8 md:pl-0 md:w-1/2 md:px-8">
              <Badge className="mb-2 bg-pfcu-purple">{event.year}</Badge>
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-gray-600">{event.description}</p>
            </div>
            
            {/* Empty space for alternate layout */}
            <div className="hidden md:block md:w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
