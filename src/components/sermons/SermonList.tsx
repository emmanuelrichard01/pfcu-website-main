import { Clock, Play, Pause } from "lucide-react";

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
  playingSermonId?: string;
  onSelectSermon: (sermon: Sermon) => void;
  onPlaySermon?: (sermon: Sermon) => void;
  formatSermonDate: (dateStr: string) => string;
}

const SermonList = ({
  sermons,
  selectedSermonId,
  playingSermonId,
  onSelectSermon,
  onPlaySermon,
  formatSermonDate
}: SermonListProps) => {

  const handlePlayClick = (e: React.MouseEvent, sermon: Sermon) => {
    e.stopPropagation();
    if (onPlaySermon) {
      onPlaySermon(sermon);
    } else {
      onSelectSermon(sermon);
    }
  };

  return (
    <div className="space-y-2">
      {sermons.map((sermon) => {
        const isSelected = selectedSermonId === sermon.id;
        const isPlaying = playingSermonId === sermon.id;

        return (
          <div
            key={sermon.id}
            onClick={() => onSelectSermon(sermon)}
            className={`
              group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all
              ${isSelected
                ? "bg-pfcu-primary/5 border border-pfcu-primary/20"
                : "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700"
              }
            `}
          >
            {/* Cover with play overlay */}
            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
              <img
                src={sermon.cover_image || "https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=200&auto=format&fit=crop"}
                alt={sermon.title}
                className="w-full h-full object-cover"
              />
              {/* Hover overlay */}
              <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <Play size={18} fill="white" className="text-white" style={{ marginLeft: '2px' }} />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-sm leading-tight mb-0.5 line-clamp-1 ${isSelected ? 'text-pfcu-primary' : 'text-zinc-900 dark:text-white'}`}>
                {sermon.title}
              </h3>
              <p className="text-xs text-zinc-500 mb-0.5">{sermon.preacher}</p>
              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                <span>{formatSermonDate(sermon.sermon_date)}</span>
                {sermon.duration && (
                  <>
                    <span className="w-0.5 h-0.5 rounded-full bg-zinc-300" />
                    <span className="flex items-center gap-1">
                      <Clock size={9} />
                      {sermon.duration}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={(e) => handlePlayClick(e, sermon)}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all
                ${isPlaying
                  ? "bg-pfcu-primary text-white"
                  : isSelected
                    ? "bg-pfcu-primary text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-pfcu-primary hover:text-white"
                }
              `}
            >
              {isPlaying ? (
                <Pause size={16} fill="currentColor" />
              ) : (
                <Play size={16} fill="currentColor" style={{ marginLeft: '2px' }} />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default SermonList;
