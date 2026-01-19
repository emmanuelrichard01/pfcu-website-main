
import { Link } from "react-router-dom";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface HomeEventCardProps {
    id: string; // Add ID prop for correct routing if we switch to UUIDs
    title: string;
    date: string;
    time: string;
    location: string;
    index: number;
    image_url?: string | null;
}

const HomeEventCard = ({ title, date, time, location, index, image_url }: HomeEventCardProps) => {
    // Extract day and month from date string
    const dateParts = date.split(' ');
    const month = dateParts[0]?.substring(0, 3).toUpperCase() || "OCT";
    const day = dateParts[1]?.replace(',', '') || "15";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="h-full"
        >
            <Card className="group h-full overflow-hidden border-none bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-zinc-900/50 dark:shadow-black/40">
                <div className="flex h-full flex-col">
                    {/* Image Container */}
                    <div className="relative h-56 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        {image_url ? (
                            <img
                                src={image_url}
                                alt={title}
                                className="h-full w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
                            />
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-br from-pfcu-primary to-purple-900 group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
                            </>
                        )}

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        {/* Date Badge */}
                        <div className="absolute left-4 top-4 flex min-w-[60px] flex-col items-center rounded-xl bg-white/95 p-2 text-center shadow-lg backdrop-blur-sm dark:bg-black/80">
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{month}</span>
                            <span className="font-heading text-2xl font-black leading-none text-pfcu-primary">{day}</span>
                        </div>

                        {/* Time Badge (Bottom Left) */}
                        <div className="absolute bottom-4 left-4">
                            <span className="inline-flex items-center rounded-lg bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md border border-white/10">
                                <Clock className="mr-1.5 h-3 w-3" />
                                {time}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <CardContent className="flex flex-grow flex-col p-6">
                        <h3 className="mb-3 font-display text-xl font-bold leading-tight text-zinc-900 transition-colors group-hover:text-pfcu-primary dark:text-white">
                            {title}
                        </h3>

                        <div className="mb-6 flex items-start text-sm text-zinc-500 dark:text-zinc-400">
                            <MapPin className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-pfcu-secondary" />
                            <span className="line-clamp-2">{location}</span>
                        </div>

                        <div className="mt-auto">
                            {/* Correct Link Logic: If routing uses index, keep index. If UUID, switch to id. */}
                            {/* Current App.tsx uses /event/:id, and EventDetails uses index lookup. So we keep `index`. */}
                            <Link to={`/event/${index}`} className="block">
                                <Button variant="ghost" className="group/btn w-full justify-between p-0 font-semibold text-pfcu-primary hover:bg-transparent hover:text-pfcu-dark dark:hover:text-white">
                                    View Details
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pfcu-primary/10 transition-all duration-300 group-hover/btn:bg-pfcu-primary group-hover/btn:text-white">
                                        <ArrowRight className="h-4 w-4" />
                                    </span>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </div>
            </Card>
        </motion.div>
    );
};

export default HomeEventCard;
