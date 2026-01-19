
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User, PlayCircle, Download, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>, sermon: Sermon) => {
    e.stopPropagation();
    if (sermon.audio_url) {
      const link = document.createElement('a');
      link.href = sermon.audio_url;
      link.download = `${sermon.title} by ${sermon.preacher}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {sermons.map((sermon) => {
        const isSelected = selectedSermonId === sermon.id;

        return (
          <div
            key={sermon.id}
            onClick={() => onSelectSermon(sermon)}
            className={`
              group relative flex flex-col sm:flex-row items-center gap-6 p-5 rounded-3xl cursor-pointer transition-all duration-300 border
              ${isSelected
                ? "bg-white dark:bg-zinc-800 border-pfcu-primary/40 shadow-xl scale-[1.02] z-10"
                : "bg-white/80 dark:bg-zinc-900/40 border-zinc-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 hover:shadow-lg hover:-translate-y-1"
              }
            `}
          >
            {/* Play Indicator / Cover Thumb */}
            <div className={`relative shrink-0 w-full sm:w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-inner hidden sm:block transition-all duration-300 ${isSelected ? 'ring-2 ring-pfcu-primary ring-offset-2 dark:ring-offset-zinc-900' : ''}`}>
              {sermon.cover_image ? (
                <img src={sermon.cover_image} alt={sermon.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
                  <Headphones size={28} />
                </div>
              )}
              {/* Overlay Icon */}
              <div className={`absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <PlayCircle className="text-white w-10 h-10 drop-shadow-lg" fill="currentColor" stroke="none" />
              </div>
            </div>

            {/* Info Content */}
            <div className="flex-1 min-w-0 w-full text-center sm:text-left space-y-1">
              <h4 className={`text-lg font-bold leading-tight transition-colors ${isSelected ? 'text-pfcu-primary' : 'text-zinc-900 dark:text-zinc-100 group-hover:text-pfcu-primary'}`}>
                {sermon.title}
              </h4>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                <User size={14} />
                <span className="font-medium">{sermon.preacher}</span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800/50 px-2.5 py-1 rounded-md">
                  <Calendar size={12} />
                  {formatSermonDate(sermon.sermon_date)}
                </span>
                {sermon.duration && (
                  <span className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                    <Clock size={12} />
                    {sermon.duration}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {sermon.audio_url && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-zinc-400 hover:text-pfcu-primary hover:bg-pfcu-primary/5 rounded-full transition-all"
                  onClick={(e) => handleDownload(e, sermon)}
                  title="Download MP3"
                >
                  <Download size={18} />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SermonList;
