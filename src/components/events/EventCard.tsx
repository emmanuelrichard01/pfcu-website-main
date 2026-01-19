
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/events";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  index: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
  const { title, description, date, time, location, category, is_featured, image_url } = event;

  const categoryColors: Record<string, string> = {
    Service: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800",
    "Bible Study": "bg-green-500/10 text-green-600 border-green-200 dark:border-green-800",
    Prayer: "bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800",
    Outreach: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800",
    Social: "bg-pink-500/10 text-pink-600 border-pink-200 dark:border-pink-800",
    Conference: "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-800",
  };

  return (
    <Card
      className="group relative overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col rounded-3xl"
    >
      {/* Event Image */}
      <div className="relative h-56 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {image_url ? (
          <>
            <img
              src={image_url}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-700 font-display font-bold text-2xl">
            PFCU
          </div>
        )}

        <div className="absolute top-4 right-4 flex gap-2">
          <Badge className={cn("backdrop-blur-md shadow-sm border", categoryColors[category] || "bg-zinc-100 text-zinc-800")}>
            {category}
          </Badge>
          {is_featured && (
            <Badge className="bg-amber-500 text-white border-none shadow-sm">Featured</Badge>
          )}
        </div>
      </div>

      <CardContent className="p-6 flex flex-col flex-1">
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex items-center text-xs font-semibold text-pfcu-primary uppercase tracking-wide mb-1">
            <Calendar className="mr-1.5 h-3.5 w-3.5" />
            {date}
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-heading leading-tight group-hover:text-pfcu-primary transition-colors">
            {title}
          </h3>
        </div>

        <p className="mb-6 text-zinc-600 dark:text-zinc-400 line-clamp-2 text-sm leading-relaxed">
          {description}
        </p>

        <div className="mt-auto space-y-4">
          <div className="space-y-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-sm">
            <div className="flex items-center text-zinc-600 dark:text-zinc-400">
              <Clock className="mr-2.5 h-4 w-4 text-zinc-400 shrink-0" />
              <span>{time}</span>
            </div>
            <div className="flex items-center text-zinc-600 dark:text-zinc-400">
              <MapPin className="mr-2.5 h-4 w-4 text-zinc-400 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>

          <Link to={`/event/${event.id}`} className="block">
            <Button variant="default" className="w-full bg-zinc-900 dark:bg-zinc-100 hover:bg-pfcu-primary dark:hover:bg-pfcu-primary text-white dark:text-zinc-900 hover:text-white dark:hover:text-white transition-all duration-300 shadow-sm group/btn rounded-xl">
              View Details
              <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
