
import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Event, EventFormValues } from "@/types/events";
import EventsTable from "@/components/admin/events/EventsTable";
import AddEventDialog from "@/components/admin/events/AddEventDialog";
import EditEventDialog from "@/components/admin/events/EditEventDialog";
import DeleteEventDialog from "@/components/admin/events/DeleteEventDialog";

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch events from Supabase
  const fetchEvents = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Cast the data to ensure it matches the Event type
      const typedData = data as Event[];
      setEvents(typedData);
    } catch (error: any) {
      toast({
        title: "Error fetching events",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onSubmit = async (data: EventFormValues) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('events')
        .insert([data]);

      if (error) {
        throw error;
      }

      toast({
        title: "Event created successfully",
        description: "The new event has been added to the calendar.",
      });

      setIsAddDialogOpen(false);
      fetchEvents();
    } catch (error: any) {
      toast({
        title: "Error creating event",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEdit = async (data: EventFormValues) => {
    if (!currentEvent) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('events')
        .update(data)
        .eq('id', currentEvent.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Event updated successfully",
        description: "The event has been updated.",
      });

      setIsEditDialogOpen(false);
      fetchEvents();
    } catch (error: any) {
      toast({
        title: "Error updating event",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!currentEvent) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', currentEvent.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Event deleted successfully",
        description: "The event has been removed from the calendar.",
      });

      setIsDeleteDialogOpen(false);
      fetchEvents();
    } catch (error: any) {
      toast({
        title: "Error deleting event",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (event: Event) => {
    setCurrentEvent(event);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (event: Event) => {
    setCurrentEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Events Calendar</h1>
          <p className="text-gray-600">Manage upcoming fellowship events</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-9 w-full sm:w-64"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            className="bg-pfcu-primary text-white hover:bg-pfcu-primary/90"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      <EventsTable
        events={filteredEvents}
        loading={loading}
        onEditEvent={handleEdit}
        onDeleteEvent={handleDelete}
      />

      <AddEventDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />

      <EditEventDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={onEdit}
        isSubmitting={isSubmitting}
        event={currentEvent}
      />

      <DeleteEventDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={onDelete}
        event={currentEvent}
      />
    </div>
  );
};

export default AdminEvents;
