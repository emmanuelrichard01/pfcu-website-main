
import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Share2 } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider"; // Assuming we might have this, or stick to input range for now if Slider isn't ready. Sticking to input range for zero-dep simplicity unless shadcn Slider is confirmed.
// Actually, standard input range is easier to style without extra deps for now.

export interface SermonPlayerProps {
  title: string;
  preacher: string;
  date?: string;
  coverImage: string;
  audioUrl: string;
}

const SermonPlayer = ({ title, preacher, date, coverImage, audioUrl }: SermonPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
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

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl transition-all duration-500 hover:shadow-pfcu-primary/5">

      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 opacity-20 pointer-events-none fade-in">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pfcu-primary/30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-pfcu-secondary/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="relative z-10 p-1">
        <div className="flex flex-col">
          {/* Cover Art Area */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 shadow-inner">
            <img
              src={coverImage || "/placeholder.svg"}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Overlay Gradient for Text readability on image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-pfcu-secondary/90 text-pfcu-dark text-[10px] font-bold uppercase tracking-wider">
                    Now Playing
                  </span>
                  {date && <span className="text-xs text-white/70 font-medium font-mono">{date}</span>}
                </div>
                <h3 className="text-2xl font-heading font-bold leading-tight mb-1 text-balance shadow-black/10 drop-shadow-md">{title}</h3>
                <p className="text-base text-white/80 font-medium">{preacher}</p>
              </motion.div>
            </div>
          </div>

          {/* Controls Area */}
          <div className="p-6 md:p-8 space-y-6">

            {/* Progress Bar */}
            <div className="space-y-2 group/timeline">
              <div className="relative h-2 w-full cursor-pointer touch-none select-none flex items-center">
                {/* Custom styled range input */}
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.1"
                  value={currentTime}
                  onChange={seek}
                  className="absolute z-20 w-full h-full opacity-0 cursor-pointer"
                />
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 -mt-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                  {/* Progress Line */}
                  <div
                    className="h-full bg-pfcu-primary transition-all duration-100 ease-linear"
                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                  />
                </div>
                {/* Thumb / Handle (Visual Only) */}
                <div
                  className="absolute top-1/2 h-3.5 w-3.5 -ml-[7px] -mt-[7px] bg-white border-2 border-pfcu-primary rounded-full shadow-md transition-all duration-100 ease-linear pointer-events-none scale-0 group-hover/timeline:scale-100"
                  style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-muted-foreground font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-between">

              {/* Volume (Hidden on small mobile) */}
              <div className="hidden sm:flex items-center gap-3 w-32 group/volume">
                <button
                  onClick={toggleMute}
                  className="text-muted-foreground hover:text-pfcu-primary transition-colors"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <div className="relative flex-1 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-zinc-400 dark:bg-zinc-500 group-hover/volume:bg-pfcu-primary transition-colors"
                    style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-6 mx-auto sm:mx-0">
                <button
                  onClick={() => skip(-10)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
                  aria-label="Rewind 10 seconds"
                >
                  <SkipBack size={22} strokeWidth={1.5} />
                </button>

                <motion.button
                  onClick={togglePlay}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative h-16 w-16 flex items-center justify-center rounded-full bg-pfcu-primary text-white shadow-lg shadow-pfcu-primary/30 hover:shadow-pfcu-primary/50 transition-all"
                >
                  {isPlaying ? (
                    <Pause size={28} fill="currentColor" className="ml-0.5" />
                  ) : (
                    <Play size={28} fill="currentColor" className="ml-1" />
                  )}
                </motion.button>

                <button
                  onClick={() => skip(10)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
                  aria-label="Skip forward 10 seconds"
                >
                  <SkipForward size={22} strokeWidth={1.5} />
                </button>
              </div>

              {/* Share / Extras (Placeholder) */}
              <div className="hidden sm:flex w-32 justify-end">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-pfcu-primary">
                  <Share2 size={18} />
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  );
};

export default SermonPlayer;
