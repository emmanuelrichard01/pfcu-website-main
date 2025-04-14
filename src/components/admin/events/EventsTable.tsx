
import { Calendar, Edit, Trash2, Clock, Badge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Event } from "@/types/events";
import { Badge as UIBadge } from "@/components/ui/badge";

interface EventsTableProps {
  events: Event[];
  loading: boolean;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (event: Event) => void;
}

const getStatusBadge = (date: string) => {
  // Determine if an event is past, upcoming, or recurring
  if (date.toLowerCase().includes('every') || date.toLowerCase().includes('each')) {
    return <UIBadge className="bg-green-500">Recurring</UIBadge>;
  }
  
  // Try to parse date if it's a specific date
  try {
    const eventDate = new Date(date.split('-')[0]);
    const today = new Date();
    
    if (eventDate < today) {
      return <UIBadge variant="outline" className="text-gray-500">Past</UIBadge>;
    } else {
      return <UIBadge className="bg-green-500">Upcoming</UIBadge>;
    }
  } catch {
    // If we can't parse the date, assume it's upcoming
    return <UIBadge className="bg-green-500">Upcoming</UIBadge>;
  }
};

export const EventsTable = ({ events, loading, onEditEvent, onDeleteEvent }: EventsTableProps) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex justify-center items-center">
                  <Clock className="h-5 w-5 text-gray-400 animate-spin mr-2" />
                  Loading events...
                </div>
              </TableCell>
            </TableRow>
          ) : events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <Calendar className="h-8 w-8 mb-2" />
                  <p>No events found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                  <div>
                    {event.title}
                    {event.is_featured && (
                      <UIBadge variant="outline" className="ml-2 bg-pfcu-gold text-white border-none text-xs">
                        Featured
                      </UIBadge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.time}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{getStatusBadge(event.date)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onEditEvent(event)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600"
                    onClick={() => onDeleteEvent(event)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventsTable;
