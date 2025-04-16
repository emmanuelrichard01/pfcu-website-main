
import { Clock, Plus } from "lucide-react";
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
import { EventFormValues } from "@/types/events";

interface AddEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EventFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const defaultValues: EventFormValues = {
  title: "",
  description: "",
  full_description: "",
  date: "",
  time: "",
  location: "",
  category: "Service",
  organizer: "",
  contact_email: "",
  contact_phone: "",
  is_featured: false
};

export const AddEventDialog = ({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  isSubmitting 
}: AddEventDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Add a new event to the fellowship calendar.
          </DialogDescription>
        </DialogHeader>
        
        <EventForm 
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          submitButtonLabel="Create Event"
          submitButtonIcon={<Plus className="mr-2 h-4 w-4" />}
        />
        
        <DialogFooter className="sticky bottom-0 bg-white pt-4 pb-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
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
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventDialog;
