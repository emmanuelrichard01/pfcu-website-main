import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react";
import { formatTime } from "@/lib/utils";

export interface SermonPlayerProps {
  title: string;
  preacher: string;
  date?: string;
  coverImage: string;
  audioUrl: string;
  mode?: "card" | "sidebar";
  autoPlay?: boolean;
}

const SermonPlayer = ({ title, preacher, date, coverImage, audioUrl, mode = "card", autoPlay = false }: SermonPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.muted = isMuted;

      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const playStateChange = () => setIsPlaying(!audio.paused);

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('durationchange', updateDuration);
      audio.addEventListener('play', playStateChange);
      audio.addEventListener('pause', playStateChange);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('durationchange', updateDuration);
        audio.removeEventListener('play', playStateChange);
        audio.removeEventListener('pause', playStateChange);
      };
    }
  }, [audioRef, volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      setCurrentTime(0);
      if (autoPlay && audioUrl) {
        audioRef.current.play().catch(() => { });
      } else {
        setIsPlaying(false);
      }
    }
  }, [audioUrl, autoPlay]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    }
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), audio.duration);
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = parseFloat(e.target.value);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const isSidebar = mode === "sidebar";

  if (isSidebar) {
    return (
      <div className="h-full flex flex-col p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Now Playing</span>
        </div>

        {/* Cover Art - Clean Square */}
        <div className="relative w-full aspect-square mb-6 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            src={coverImage || "https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=400&auto=format&fit=crop"}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1 line-clamp-2">{title}</h2>
          <p className="text-sm text-pfcu-primary font-medium">{preacher}</p>
          {date && <p className="text-xs text-zinc-400 mt-1">{date}</p>}
        </div>

        {/* Progress */}
        <div className="mb-6 space-y-2">
          <div className="relative h-1 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-pfcu-primary rounded-full transition-all"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={currentTime}
              onChange={seek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-xs text-zinc-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => skip(-10)}
            className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <SkipBack size={20} />
          </button>

          <button
            onClick={togglePlay}
            className="h-14 w-14 bg-pfcu-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-pfcu-primary/90 transition-colors"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-0.5" />}
          </button>

          <button
            onClick={() => skip(10)}
            className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <SkipForward size={20} />
          </button>
        </div>

        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      </div>
    );
  }

  // Card Mode - Compact for mobile
  return (
    <div className="flex items-center gap-4 p-4">
      {/* Cover */}
      <div className="w-14 h-14 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
        <img
          src={coverImage || "https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=100&auto=format&fit=crop"}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{title}</h3>
        <p className="text-xs text-zinc-500 truncate">{preacher}</p>
      </div>

      {/* Play Button */}
      <button
        onClick={togglePlay}
        className="h-10 w-10 bg-pfcu-primary text-white rounded-full flex items-center justify-center shrink-0"
      >
        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
      </button>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  );
};

export default SermonPlayer;
