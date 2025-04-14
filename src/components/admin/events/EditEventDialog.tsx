
import { Check, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EventForm from "./EventForm";
import { Event, EventFormValues } from "@/types/events";

interface EditEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EventFormValues) => Promise<void>;
  isSubmitting: boolean;
  event: Event | null;
}

export const EditEventDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isSubmitting,
  event
}: EditEventDialogProps) => {
  if (!event) return null;
  
  const defaultValues: EventFormValues = {
    title: event.title,
    description: event.description,
    full_description: event.full_description,
    date: event.date,
    time: event.time,
    location: event.location,
    category: event.category,
    organizer: event.organizer,
    contact_email: event.contact_email,
    contact_phone: event.contact_phone,
    is_featured: event.is_featured
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update the details of this event.
          </DialogDescription>
        </DialogHeader>
        
        <EventForm 
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          submitButtonLabel="Update Event"
          submitButtonIcon={<Check className="mr-2 h-4 w-4" />}
        />
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="event-form"
            className="bg-pfcu-purple hover:bg-pfcu-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Update Event
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventDialog;
