
import { Calendar, Edit, Trash2, Clock, MapPin, MoreHorizontal } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EventsTableProps {
  events: Event[];
  loading: boolean;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (event: Event) => void;
}

const getStatusBadge = (date: string) => {
  if (date.toLowerCase().includes('every') || date.toLowerCase().includes('each')) {
    return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 shadow-none font-medium">Recurring</Badge>;
  }

  try {
    const eventDate = new Date(date.split('-')[0]);
    const today = new Date();

    if (eventDate < today) {
      return <Badge variant="outline" className="text-zinc-500 border-zinc-200 shadow-none font-medium">Past</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200 shadow-none font-medium">Upcoming</Badge>;
    }
  } catch {
    return <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200 shadow-none font-medium">Upcoming</Badge>;
  }
};

export const EventsTable = ({ events, loading, onEditEvent, onDeleteEvent }: EventsTableProps) => {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Details</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center">
                <div className="flex justify-center items-center gap-2 text-zinc-500">
                  <Clock className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading events...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center text-zinc-500">
                  <Calendar className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-sm">No events found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => (
              <TableRow key={event.id} className="group">
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{event.title}</span>
                      {event.is_featured && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] px-1.5 py-0 shadow-none">
                          Featured
                        </Badge>
                      )}
                    </div>
                    {event.description && (
                      <span className="text-xs text-zinc-500 line-clamp-1 max-w-[250px]">{event.description}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{event.date}</span>
                    <span className="text-xs text-zinc-500">{event.time}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 text-sm">
                    <MapPin size={14} className="opacity-70" />
                    <span>{event.location}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(event.date)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      onClick={() => onEditEvent(event)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      onClick={() => onDeleteEvent(event)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
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
