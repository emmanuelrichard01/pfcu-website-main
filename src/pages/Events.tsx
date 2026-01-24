import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/events";
import { Calendar, Clock, ArrowRight, Search, MapPin, Sparkles, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/badge";

const Events = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

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

    // Fallback image source
    const fallbackImage = "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop";

    if (loading) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pfcu-primary"></div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">

                {/* --- Cinematic Hero (Refined Style) --- */}
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pfcu-primary/5 via-zinc-50/0 to-zinc-50/0 dark:from-pfcu-primary/10 dark:via-zinc-950/0 dark:to-zinc-950/0" />
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />

                        {/* Floating Doodles */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="absolute top-1/4 left-10 md:left-20 text-pfcu-primary/20 hidden lg:block"
                        >
                            <Calendar size={64} />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="absolute top-1/3 right-10 md:right-20 text-blue-500/20 hidden lg:block"
                        >
                            <Clock size={56} />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 1.1 }}
                            className="absolute bottom-1/4 left-1/4 text-purple-500/20 hidden lg:block"
                        >
                            <Zap size={40} />
                        </motion.div>
                    </div>

                    <div className="container mx-auto max-w-5xl relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8">
                                <Sparkles size={14} className="text-pfcu-primary fill-pfcu-primary" />
                                <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">Community Calendar</span>
                            </div>

                            <motion.h1
                                className="text-5xl md:text-7xl font-heading font-bold text-zinc-900 dark:text-white tracking-tight mb-8"
                            >
                                Gather. Grow. <br />
                                <span className="text-pfcu-primary relative">
                                    Go Together.
                                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-pfcu-primary/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
                                    </svg>
                                </span>
                            </motion.h1>

                            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                                Join us for life-changing moments. From weekly services to major conferences, find your place in our story.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* --- Search & Filter Bar (Refined) --- */}
                <section className="top-20 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 py-4 mb-16">
                    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Categories */}
                        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar mask-gradient">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`
                                        whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300
                                        ${filter === cat
                                            ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20 dark:bg-white dark:text-zinc-900"
                                            : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"}
                                    `}
                                >
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                            <Input
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-10 rounded-full bg-zinc-100 border-transparent focus:bg-white focus:border-zinc-300 transition-all dark:bg-zinc-900 dark:border-zinc-800"
                            />
                        </div>
                    </div>
                </section>

                {/* --- Content Area --- */}
                <div className="container mx-auto max-w-7xl px-4 md:px-8 pb-32">

                    {/* Featured Event (Adapting to Light/Dark) */}
                    {featuredEvent && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="mb-24"
                        >
                            <Link to={`/event/${featuredEvent.id}`} className="group block relative aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-[2.5rem] shadow-2xl shadow-zinc-900/20 dark:shadow-black/50">
                                <div className="absolute inset-0 bg-zinc-900 transition-colors duration-500" />
                                <img
                                    src={featuredEvent.image_url || fallbackImage}
                                    alt={featuredEvent.title}
                                    className="w-full h-full object-cover opacity-90 transition-transform duration-1000 ease-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 flex flex-col items-start">
                                    <Badge className="bg-white text-zinc-950 hover:bg-zinc-200 border-none text-xs font-bold px-3 py-1 mb-6 uppercase tracking-widest">
                                        Featured Event
                                    </Badge>
                                    <h2 className="text-3xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight group-hover:underline decoration-2 underline-offset-8 decoration-white/30 transition-all">
                                        {featuredEvent.title}
                                    </h2>

                                    <div className="flex flex-wrap items-center gap-6 text-white/90 text-base md:text-lg font-medium">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-pfcu-primary" />
                                            {new Date(featuredEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                        </div>
                                        <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/30" />
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-pfcu-primary" />
                                            {featuredEvent.time}
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-8 right-8 md:bottom-16 md:right-16 w-16 h-16 bg-white rounded-full flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-[-45deg] group-hover:bg-pfcu-primary group-hover:text-white">
                                    <ArrowRight size={24} />
                                </div>
                            </Link>
                        </motion.div>
                    )}

                    {/* Events Grid (Refined Cards) */}
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredEvents.map((event) => (
                                <motion.div
                                    layout
                                    key={event.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Link to={`/event/${event.id}`} className="group h-full flex flex-col bg-white dark:bg-zinc-900 rounded-[2rem] p-4 hover:shadow-2xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-all duration-500 border border-zinc-200 dark:border-zinc-800 hover:-translate-y-1">
                                        {/* Image Area */}
                                        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] mb-6 bg-zinc-100 dark:bg-zinc-800">
                                            <img
                                                src={event.image_url || fallbackImage}
                                                alt={event.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <div className="bg-white/95 dark:bg-zinc-900/90 backdrop-blur shadow-sm rounded-xl px-3 py-2 text-center min-w-[60px]">
                                                    <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                                    <span className="block text-xl font-bold text-zinc-900 dark:text-white leading-none">{new Date(event.date).getDate()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="px-2 pb-2 flex-1 flex flex-col">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md">
                                                    {event.category}
                                                </Badge>
                                            </div>

                                            <h3 className="text-2xl font-bold font-heading text-zinc-900 dark:text-white mb-3 leading-tight group-hover:text-pfcu-primary transition-colors">
                                                {event.title}
                                            </h3>

                                            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-2 mb-6 flex-1">
                                                {event.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-4 border-t border-zinc-50 dark:border-zinc-800 mt-auto">
                                                <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock size={14} /> {event.time}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin size={14} /> {event.location}
                                                    </span>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center group-hover:bg-pfcu-primary group-hover:text-white transition-colors">
                                                    <ArrowRight size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Empty State */}
                    {filteredEvents.length === 0 && (
                        <div className="text-center py-32 bg-zinc-50 dark:bg-zinc-900/50 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800">
                            <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
                                <Search className="text-zinc-300 dark:text-zinc-600" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No events found</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-xs mx-auto">We couldn't find any events matching your search criteria.</p>
                            <Button
                                onClick={() => { setFilter("all"); setSearchQuery(""); }}
                                variant="outline"
                                className="rounded-full px-8 border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Events;
