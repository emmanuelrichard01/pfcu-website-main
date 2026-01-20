import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/events";
import { Calendar, Clock, MapPin, ArrowLeft, Share2, CalendarPlus, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layout/MainLayout";
import { Skeleton } from "@/components/ui/skeleton";

const EventDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fallbackImage = "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop";

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id) {
                setError("Event not found");
                setLoading(false);
                return;
            }

            try {
                const { data, error: fetchError } = await supabase
                    .from('events')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (fetchError) throw fetchError;
                setEvent(data as Event);
            } catch (err) {
                console.error("Error fetching event:", err);
                setError("Failed to load event details");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleShare = async () => {
        if (navigator.share && event) {
            try {
                await navigator.share({
                    title: event.title,
                    text: event.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Share cancelled or failed");
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="min-h-screen bg-white py-20">
                    <div className="container mx-auto max-w-6xl px-4">
                        <Skeleton className="h-8 w-32 mb-8" />
                        <Skeleton className="h-12 w-3/4 mb-4" />
                        <Skeleton className="h-6 w-1/2 mb-8" />
                        <Skeleton className="aspect-[21/9] w-full rounded-3xl mb-12" />
                        <div className="grid lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-2 space-y-4">
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-6 w-3/4" />
                            </div>
                            <Skeleton className="h-64 rounded-2xl" />
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (error || !event) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-zinc-900 mb-4">{error || "Event not found"}</h1>
                        <Button onClick={() => navigate("/events")}>Back to Events</Button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen bg-white"
            >
                <div className="container mx-auto max-w-6xl px-4 pt-32 pb-20">
                    {/* Header Actions */}
                    <div className="flex items-center justify-between mb-8">
                        <Button
                            variant="ghost"
                            className="gap-2 text-zinc-500 hover:text-zinc-900 pl-0 hover:bg-transparent transition-colors"
                            onClick={() => navigate("/events")}
                        >
                            <ArrowLeft size={20} />
                            <span className="font-medium">Back to Events</span>
                        </Button>

                        <Badge variant="secondary" className="bg-zinc-100 text-zinc-900 border-zinc-200 px-3 py-1 rounded-full">
                            {event.category}
                        </Badge>
                    </div>

                    {/* Title Section */}
                    <div className="mb-10">
                        <h1 className="text-4xl md:text-6xl font-heading font-bold text-zinc-900 leading-[1.1] mb-6">
                            {event.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-zinc-500 font-medium">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-pfcu-primary" />
                                {event.date}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-pfcu-primary" />
                                {event.time}
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-pfcu-primary" />
                                {event.location}
                            </div>
                        </div>
                    </div>

                    {/* Cinematic Image */}
                    <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl bg-zinc-100 mb-16">
                        <img
                            src={event.image_url || fallbackImage}
                            alt={event.title}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Content Grid */}
                    <div className="grid lg:grid-cols-3 gap-12 lg:gap-24">
                        {/* Main Text */}
                        <div className="lg:col-span-2">
                            <h3 className="text-2xl font-bold text-zinc-900 mb-6">About this Event</h3>
                            <div className="prose prose-lg prose-zinc max-w-none text-zinc-600 leading-relaxed">
                                <p className="mb-6">{event.description}</p>
                                {event.full_description && (
                                    <p className="whitespace-pre-wrap">{event.full_description}</p>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32 space-y-6">
                                {/* Register Box */}
                                <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                                    <h4 className="font-bold text-zinc-900 mb-4">Join this Event</h4>
                                    <Button className="w-full bg-pfcu-primary hover:bg-pfcu-primary/90 rounded-xl" asChild>
                                        <a href="/contact">Register Now</a>
                                    </Button>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <Button variant="outline" className="flex-1 rounded-xl" onClick={handleShare}>
                                        <Share2 className="w-4 h-4 mr-2" /> Share
                                    </Button>
                                    <Button variant="outline" className="flex-1 rounded-xl">
                                        <CalendarPlus className="w-4 h-4 mr-2" /> Add to Cal
                                    </Button>
                                </div>

                                {/* Organizer Info */}
                                {(event.organizer || event.contact_email || event.contact_phone) && (
                                    <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                                        <h4 className="font-bold text-zinc-900 mb-4">Contact</h4>
                                        <div className="space-y-3 text-sm text-zinc-600">
                                            {event.organizer && (
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-pfcu-primary" />
                                                    <span>{event.organizer}</span>
                                                </div>
                                            )}
                                            {event.contact_email && (
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-pfcu-primary" />
                                                    <a href={`mailto:${event.contact_email}`} className="hover:text-pfcu-primary transition-colors">
                                                        {event.contact_email}
                                                    </a>
                                                </div>
                                            )}
                                            {event.contact_phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-pfcu-primary" />
                                                    <a href={`tel:${event.contact_phone}`} className="hover:text-pfcu-primary transition-colors">
                                                        {event.contact_phone}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </MainLayout>
    );
};

export default EventDetails;
