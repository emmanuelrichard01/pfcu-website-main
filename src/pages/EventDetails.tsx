
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ArrowLeft, Calendar as CalIcon, Share2, Heart, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/events";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      setLoading(true);

      try {
        // Fetch event using UUID if it's a UUID, otherwise try legacy index method
        let data, error;

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        if (isUuid) {
          const result = await supabase
            .from('events')
            .select('*')
            .eq('id', id)
            .single();
          data = result.data;
          error = result.error;
        } else {
          // Legacy fallback: fetch all and find by index (deprecated but kept for temporary compatibility)
          const result = await supabase.from('events').select('*');
          if (result.data) {
            const index = parseInt(id);
            if (!isNaN(index) && result.data[index]) {
              data = result.data[index];
            } else {
              error = { message: "Event not found" };
            }
          } else {
            error = result.error;
          }
        }

        if (error) throw error;
        setEvent(data as Event);
      } catch (error: any) {
        toast({
          title: "Error loading event",
          description: "Could not find the requested event.",
          variant: "destructive"
        });
        navigate("/events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate, toast]);

  const categoryColors: Record<string, string> = {
    Service: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800",
    "Bible Study": "bg-green-500/10 text-green-600 border-green-200 dark:border-green-800",
    Prayer: "bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800",
    Outreach: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800",
    Social: "bg-pink-500/10 text-pink-600 border-pink-200 dark:border-pink-800",
    Conference: "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-800",
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      }).catch((error) => console.log("Error sharing:", error));
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
          <div className="w-full max-w-4xl space-y-8">
            <Skeleton className="h-10 w-48" />
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-[400px] w-full rounded-2xl" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-64 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!event) return null;

  return (
    <MainLayout>
      <div className="bg-zinc-50 dark:bg-black py-12 md:py-20 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          <Button
            variant="ghost"
            className="mb-8 group flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 pl-0 hover:bg-transparent"
            onClick={() => navigate("/events")}
          >
            <div className="rounded-full bg-zinc-100 p-2 transition-colors group-hover:bg-zinc-200 dark:bg-zinc-800 dark:group-hover:bg-zinc-700">
              <ArrowLeft size={16} />
            </div>
            <span className="font-medium">Back to events</span>
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-3 gap-8 lg:gap-12"
          >
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Section */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-zinc-900 aspect-video">
                {event.is_featured && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                  </div>
                )}

                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center">
                    <span className="text-zinc-700 font-display text-4xl font-bold opacity-20">PFCU EVENTS</span>
                  </div>
                )}
                {/* Gradient overlay for text legibility if we put text over image, mostly decorative here */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>

              {/* Title and Badges */}
              <div>
                <div className="flex flex-wrap gap-3 mb-4">
                  <Badge variant="outline" className={cn("rounded-full px-4 py-1 border", categoryColors[event.category])}>
                    {event.category}
                  </Badge>
                  {event.is_featured && (
                    <Badge className="bg-amber-500 text-white border-none rounded-full px-4 py-1">Featured</Badge>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-black text-zinc-900 dark:text-zinc-50 leading-tight mb-6">
                  {event.title}
                </h1>

                <div className="prose prose-lg dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400">
                  <p className="lead">{event.description}</p>
                  <div className="mt-6 space-y-4">
                    {event.full_description ? (
                      <p>{event.full_description}</p>
                    ) : (
                      <p className="italic text-zinc-500">No additional details provided.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Event Key Info Card */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900/50 backdrop-blur-xl sticky top-24">
                <h3 className="font-display text-xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">Event Details</h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-pfcu-primary/10 p-3 text-pfcu-primary">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Date</p>
                      <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{event.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-pfcu-primary/10 p-3 text-pfcu-primary">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Time</p>
                      <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-pfcu-primary/10 p-3 text-pfcu-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Location</p>
                      <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{event.location}</p>
                      <Button variant="link" className="h-auto p-0 text-pfcu-primary font-medium text-sm">
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </div>

                <hr className="my-6 border-zinc-100 dark:border-zinc-800" />

                {/* Actions */}
                <div className="space-y-3">
                  <Button className="w-full bg-pfcu-primary hover:bg-pfcu-primary/90 text-white h-12 rounded-xl text-base font-medium shadow-lg shadow-pfcu-primary/20" onClick={handleAddCalendar}>
                    <CalIcon className="mr-2 h-4 w-4" />
                    Add to Calendar
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full rounded-xl border-zinc-200 dark:border-zinc-700" onClick={handleShare}>
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <Button variant="outline" className="w-full rounded-xl border-zinc-200 dark:border-zinc-700">
                      <Heart className="mr-2 h-4 w-4" /> Save
                    </Button>
                  </div>
                </div>

                {/* Organizer Info */}
                {(event.organizer || event.contact_email) && (
                  <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-4">Organizer Contact</h4>
                    <div className="space-y-3">
                      {event.organizer && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">{event.organizer}</p>
                      )}
                      {event.contact_email && (
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                          <Mail className="h-4 w-4" />
                          <span>{event.contact_email}</span>
                        </div>
                      )}
                      {event.contact_phone && (
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                          <Phone className="h-4 w-4" />
                          <span>{event.contact_phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EventDetails;
