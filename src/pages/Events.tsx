import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/events";
import { Calendar, Clock, ArrowRight, Search, MapPin, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/badge";

const Events = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Parallax logic
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const today = new Date().toISOString();
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .gte('date', today)
                    .order('is_featured', { ascending: false })
                    .order('date', { ascending: true });

                if (error) throw error;
                setEvents(data as Event[]);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const categories = ["all", ...new Set(events.map(e => e.category.toLowerCase()))];
    const featuredEvent = events.find(e => e.is_featured);
    const filteredEvents = events
        .filter(e => !e.is_featured)
        .filter(e => filter === "all" || e.category.toLowerCase() === filter)
        .filter(e =>
            e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const fallbackImage = "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop";

    if (loading) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900"></div>
                        <p className="text-zinc-400 text-sm font-medium animate-pulse">Loading Events...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="bg-zinc-50 min-h-screen">
                {/* Immersive Hero Section */}
                <section className="relative h-[70vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
                    <motion.div
                        style={{ y: y1 }}
                        className="absolute inset-0 z-0"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1510936111840-65e151ad71bb?auto=format&fit=crop&q=80&w=2000"
                            alt="Worship Gathering"
                            className="w-full h-full object-cover scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-zinc-50" />
                    </motion.div>

                    <motion.div
                        style={{ opacity }}
                        className="relative z-10 container mx-auto px-4 pt-20"
                    >
                        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-6"
                            >
                                <span className="w-2 h-2 rounded-full bg-pfcu-primary animate-pulse"></span>
                                Community Calendar
                            </motion.span>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white tracking-tighter leading-[0.9] mb-6 md:mb-8"
                            >
                                Gather.
                                {' '}<span className="text-white/80">Grow.</span>{' '}
                                <span className="text-white/60">Go.</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-base sm:text-lg md:text-xl text-white/80 max-w-lg leading-relaxed mb-8 md:mb-10 px-4 md:px-0"
                            >
                                Join us for life-changing moments. From Sunday services to community outreach, find your place in our story.
                            </motion.p>
                        </div>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        style={{ opacity }}
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/50"
                    >
                        <ChevronDown size={32} />
                    </motion.div>
                </section>

                <div className="relative z-20 -mt-20 pb-24 px-4 md:px-8">
                    <div className="container mx-auto max-w-7xl">

                        {/* Featured Event - Magazine Style */}
                        {featuredEvent && (
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                                className="mb-24"
                            >
                                <Link to={`/event/${featuredEvent.id}`} className="group block relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/8] overflow-hidden rounded-2xl md:rounded-[2.5rem] shadow-2xl shadow-black/20">
                                    <div className="absolute inset-0 bg-zinc-900" />
                                    <img
                                        src={featuredEvent.image_url || fallbackImage}
                                        alt={featuredEvent.title}
                                        className="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-16">
                                        <div className="max-w-3xl">
                                            <Badge className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border-transparent text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 sm:py-1.5 mb-3 sm:mb-6 rounded-full uppercase tracking-wider">
                                                Featured Event
                                            </Badge>
                                            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-3 sm:mb-6 leading-tight group-hover:text-white/90 transition-colors">
                                                {featuredEvent.title}
                                            </h2>
                                            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-white/80 text-sm sm:text-base md:text-lg font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-5 h-5 text-pfcu-primary" />
                                                    {featuredEvent.date}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-5 h-5 text-pfcu-primary" />
                                                    {featuredEvent.time}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 md:bottom-16 md:right-16 bg-white text-zinc-900 rounded-full w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-45">
                                        <ArrowRight size={16} className="sm:hidden" />
                                        <ArrowRight size={20} className="hidden sm:block md:hidden" />
                                        <ArrowRight size={24} className="hidden md:block" />
                                    </div>
                                </Link>
                            </motion.div>
                        )}

                        {/* Sticky Search & Filter Bar */}
                        <div className="sticky top-24 z-30 mb-16 -mx-4 px-4 md:mx-0 md:px-0">
                            <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg shadow-zinc-200/50 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
                                <div className="relative flex-1 w-full">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                                    <Input
                                        placeholder="Find an event..."
                                        className="pl-12 h-12 bg-zinc-50/50 border-zinc-200 focus:bg-white transition-all rounded-xl text-base"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setFilter(cat)}
                                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${filter === cat
                                                ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20 scale-105"
                                                : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                                                }`}
                                        >
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Events Grid */}
                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredEvents.map((event) => (
                                    <motion.div
                                        layout
                                        key={event.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Link to={`/event/${event.id}`} className="group h-full flex flex-col bg-white rounded-3xl p-3 hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 border border-zinc-100/50">
                                            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-4 bg-zinc-100">
                                                <img
                                                    src={event.image_url || fallbackImage}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-zinc-900 shadow-sm">
                                                    {event.category}
                                                </div>
                                            </div>

                                            <div className="px-2 pb-2 flex-1 flex flex-col">
                                                <div className="flex items-center gap-2 text-pfcu-primary text-xs font-bold uppercase tracking-wider mb-3">
                                                    <Calendar size={12} strokeWidth={2.5} />
                                                    {event.date}
                                                </div>

                                                <h3 className="text-xl font-bold font-heading text-zinc-900 mb-3 leading-tight group-hover:text-pfcu-primary transition-colors line-clamp-2">
                                                    {event.title}
                                                </h3>

                                                <p className="text-sm text-zinc-500 line-clamp-2 mb-6 leading-relaxed flex-1">
                                                    {event.description}
                                                </p>

                                                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 mt-auto">
                                                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
                                                        <Clock size={12} />
                                                        {event.time}
                                                    </div>
                                                    <span className="text-xs font-bold text-zinc-900 group-hover:translate-x-1 transition-transform inline-flex items-center">
                                                        Details <ArrowRight size={12} className="ml-1" />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {filteredEvents.length === 0 && (
                            <div className="text-center py-32">
                                <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="text-zinc-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-2">No events found</h3>
                                <p className="text-zinc-500 mb-8">We couldn't find any events matching your search.</p>
                                <Button
                                    onClick={() => { setFilter("all"); setSearchQuery(""); }}
                                    variant="outline"
                                    className="rounded-full px-8"
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Events;
