
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/events";
import { cn } from "@/lib/utils";

interface FeaturedEventCardProps {
    event: Event;
    index: number;
}

const FeaturedEventCard = ({ event, index }: FeaturedEventCardProps) => {
    const { title, description, date, time, location, category, image_url } = event;

    const categoryColors: Record<string, string> = {
        Service: "bg-blue-500/20 text-blue-200 border-blue-500/30",
        "Bible Study": "bg-green-500/20 text-green-200 border-green-500/30",
        Prayer: "bg-purple-500/20 text-purple-200 border-purple-500/30",
        Outreach: "bg-orange-500/20 text-orange-200 border-orange-500/30",
        Social: "bg-pink-500/20 text-pink-200 border-pink-500/30",
        Conference: "bg-yellow-500/20 text-yellow-200 border-yellow-500/30",
    };

    return (
        <div className="group relative h-[500px] w-full overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl transition-all duration-500 hover:shadow-pfcu-primary/20">
            {/* Background Image with Zoom Effect */}
            <div className="absolute inset-0 h-full w-full overflow-hidden">
                {image_url ? (
                    <img
                        src={image_url}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-zinc-800 to-zinc-950" />
                )}
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent opacity-60" />
            </div>

            {/* Top Badges */}
            <div className="absolute left-6 top-6 flex w-[calc(100%-3rem)] justify-between">
                <Badge className={cn("backdrop-blur-md border", categoryColors[category] || "bg-white/10 text-white border-white/20")}>
                    {category}
                </Badge>
                <div className="flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300 backdrop-blur-md border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    Featured
                </div>
            </div>

            {/* Content Content - Glassmorphism Card at Bottom */}
            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
                    <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                            <Calendar className="h-4 w-4 text-pfcu-primary" />
                            <span>{date}</span>
                            <span className="h-1 w-1 rounded-full bg-zinc-500" />
                            <Clock className="h-4 w-4 text-pfcu-primary" />
                            <span>{time}</span>
                        </div>
                        <h3 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl md:text-3xl lg:text-3xl">
                            {title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <MapPin className="h-4 w-4 text-pfcu-secondary" />
                            <span className="truncate">{location}</span>
                        </div>
                    </div>

                    <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-zinc-300 opacity-0 transition-all duration-500 group-hover:opacity-100 hidden sm:block h-0 group-hover:h-auto">
                        {description}
                    </p>

                    <Link to={`/event/${event.id}`} className="block">
                        <Button className="group/btn w-full bg-white text-zinc-950 hover:bg-zinc-200">
                            View Event Details
                            <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FeaturedEventCard;
