import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, ArrowRight, Search, Filter, Sparkles, ChevronRight } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
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

  const featuredEvent = events.find(e => e.is_featured) || events[0];
  const upcomingEvents = events.filter(e => e.id !== featuredEvent?.id);
  const categories = ["all", ...new Set(events.map(e => e.category))];

  const filteredEvents = upcomingEvents.filter(event => {
    const matchesCategory = filter === "all" || event.category === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <MainLayout>
      {/* --- HERO SECTION --- */}
      <div className="relative bg-zinc-950 min-h-[60vh] flex items-center overflow-hidden pt-20">
        {/* Abstract Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pfcu-primary/20 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 mix-blend-screen" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05]" />
        </div>

        <div className="container relative z-10 mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="flex-1 text-center md:text-left"
            >
              <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full border-white/10 bg-white/5 text-white/80 backdrop-blur-md uppercase tracking-widest text-xs font-bold">
                Fellowship & Community
              </Badge>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white tracking-tight leading-[1] mb-8">
                Moments <br /> that <span className="text-transparent bg-clip-text bg-gradient-to-r from-pfcu-primary to-orange-400">Matter.</span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed mb-10 mx-auto md:mx-0">
                Join us as we gather to worship, learn, and grow together. There is always a place for you in our circle.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- WEEKLY RHYTHMS (Static) --- */}
      <div className="bg-white border-b border-zinc-100 relative z-20 -mt-10 mx-4 md:mx-10 rounded-2xl shadow-xl shadow-zinc-200/50 p-6 md:p-10 mb-20 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/4">
            <h3 className="font-heading font-bold text-2xl mb-2">Weekly Rhythms</h3>
            <p className="text-sm text-zinc-500">Our recurring gatherings.</p>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {[
              { day: "Sunday", time: "8:00 AM", title: "Celebration Service", desc: "Worship & Word" },
              { day: "Wednesday", time: "6:00 PM", title: "Bible Study", desc: "Digging Deep" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-zinc-50 p-4 rounded-xl border border-zinc-100 hover:border-pfcu-primary/30 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-pfcu-primary font-bold shadow-sm group-hover:scale-110 transition-transform">
                  {item.day.slice(0, 3)}
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900">{item.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                    <Clock size={12} /> {item.time}
                    <span className="w-1 h-1 rounded-full bg-zinc-300" />
                    <span>{item.desc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl pb-24">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-pfcu-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <>
            {/* --- FEATURED SPOTLIGHT --- */}
            {featuredEvent && (
              <section className="mb-24">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-zinc-200"></div>
                  <span className="uppercase tracking-widest text-xs font-bold text-pfcu-primary">Don't Miss Out</span>
                  <div className="h-px flex-1 bg-zinc-200"></div>
                </div>

                <div className="group relative rounded-[2.5rem] overflow-hidden bg-zinc-900 text-white min-h-[500px] flex flex-col md:flex-row">
                  {/* Image/Background */}
                  <div className="absolute inset-0 z-0">
                    {featuredEvent.image_url ? (
                      <img src={featuredEvent.image_url} alt={featuredEvent.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pfcu-primary to-zinc-900 opacity-80" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex-1 p-8 md:p-16 flex flex-col justify-center items-start">
                    <div className="inline-block px-3 py-1 bg-pfcu-primary text-white text-xs font-bold uppercase tracking-wider rounded-md mb-6">
                      Featured Event
                    </div>
                    <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight max-w-2xl">
                      {featuredEvent.title}
                    </h2>
                    <p className="text-lg text-gray-300 mb-8 max-w-xl line-clamp-3">
                      {featuredEvent.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-sm font-medium mb-10">
                      <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                        <Calendar className="w-4 h-4 text-pfcu-primary" />
                        <span>{format(parseISO(featuredEvent.date), "MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                        <Clock className="w-4 h-4 text-pfcu-primary" />
                        <span>{featuredEvent.time}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                        <MapPin className="w-4 h-4 text-pfcu-primary" />
                        <span>{featuredEvent.location}</span>
                      </div>
                    </div>

                    {/* <Link to="/contact"> */}
                    <Button className="h-14 px-8 rounded-full bg-white text-zinc-900 hover:bg-zinc-200 font-bold text-base transition-all hover:scale-105">
                      Register Now <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    {/* </Link> */}
                  </div>
                </div>
              </section>
            )}

            {/* --- UPCOMING EVENTS GRID --- */}
            <section>
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                  <h2 className="text-4xl font-heading font-bold text-zinc-900 mb-3">Upcoming Events</h2>
                  <p className="text-zinc-500">Discover what's happening next in our community.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === cat
                        ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20"
                        : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                        }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-12 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <Input
                  placeholder="Search events..."
                  className="pl-12 h-12 rounded-2xl bg-zinc-50 border-zinc-200 focus:ring-pfcu-primary/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence>
                  {filteredEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      variants={fadeInUp}
                      layout
                      className="group bg-white rounded-[2rem] border border-zinc-100 overflow-hidden hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 hover:-translate-y-1"
                    >
                      {/* Card Image */}
                      <div className="aspect-[4/3] bg-zinc-100 relative overflow-hidden">
                        {event.image_url ? (
                          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-50 text-zinc-300">
                            <Calendar size={48} />
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-zinc-900 shadow-sm border border-white/20">
                          {event.category}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-8">
                        <div className="flex items-center gap-2 text-pfcu-primary text-xs font-bold uppercase tracking-wider mb-3">
                          <Calendar size={14} />
                          {format(parseISO(event.date), "MMM d, yyyy")}
                        </div>

                        <h3 className="text-xl font-bold font-heading text-zinc-900 mb-3 group-hover:text-pfcu-primary transition-colors">
                          {event.title}
                        </h3>

                        <p className="text-sm text-zinc-500 line-clamp-2 mb-6 leading-relaxed">
                          {event.description}
                        </p>

                        <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                            <Clock size={12} />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 group-hover:translate-x-1 transition-transform">
                            Details <ChevronRight size={12} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {filteredEvents.length === 0 && (
                <div className="text-center py-20 bg-zinc-50 rounded-[2rem] border border-dashed border-zinc-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-zinc-400">
                    <Search size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-2">No events found</h3>
                  <p className="text-zinc-500 max-w-xs mx-auto">Try adjusting your search or filters to find what you're looking for.</p>
                  <Button variant="outline" onClick={() => { setFilter("all"); setSearchQuery(""); }} className="mt-6">Clear All Filters</Button>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Events;
