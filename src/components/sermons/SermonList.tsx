
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";

interface Sermon {
  id: string;
  title: string;
  preacher: string;
  sermon_date: string;
  description: string | null;
  duration: string | null;
  audio_url: string | null;
  cover_image: string | null;
}

interface SermonListProps {
  sermons: Sermon[];
  selectedSermonId?: string;
  onSelectSermon: (sermon: Sermon) => void;
  formatSermonDate: (dateStr: string) => string;
}

const SermonList = ({ 
  sermons, 
  selectedSermonId, 
  onSelectSermon,
  formatSermonDate
}: SermonListProps) => {
  return (
    <div className="space-y-6">
      {sermons.map((sermon) => (
        <Card
          key={sermon.id}
          className={`overflow-hidden transition-all cursor-pointer hover:shadow-md ${
            selectedSermonId === sermon.id ? "ring-2 ring-pfcu-purple" : ""
          }`}
          onClick={() => onSelectSermon(sermon)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-start">
              <div className="truncate text-lg">{sermon.title}</div>
            </CardTitle>
            
            <CardDescription className="flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4" />
              {formatSermonDate(sermon.sermon_date)}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-2">
            {sermon.description && (
              <p className="text-gray-700 line-clamp-2 text-sm">
                {sermon.description}
              </p>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between items-center pt-0">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <User className="h-4 w-4" />
              {sermon.preacher}
            </div>
            
            {sermon.duration && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                {sermon.duration}
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SermonList;
