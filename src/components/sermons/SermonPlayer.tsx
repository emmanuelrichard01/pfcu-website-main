import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Download, ChevronDown, MoreHorizontal, Repeat, ChevronUp } from "lucide-react";
import { formatTime } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

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
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.muted = isMuted;
      audio.playbackRate = playbackRate;

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
  }, [audioRef, volume, isMuted, playbackRate]);

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

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    }
  };

  const skip = (seconds: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), audio.duration);
    }
  };

  const seek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = value[0];
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    setPlaybackRate(speeds[nextIndex]);
  };

  const handleDownload = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!audioUrl) return;
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `${title} - ${preacher}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isSidebar = mode === "sidebar";

  if (isSidebar) {
    return (
      <div className="h-full flex flex-col p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Now Playing</span>
          <button
            onClick={handleDownload}
            className="p-2 -mr-2 text-zinc-400 hover:text-pfcu-primary transition-colors"
            title="Download Sermon"
          >
            <Download size={16} />
          </button>
        </div>

        {/* Cover Art */}
        <div className="relative w-full max-w-[240px] mx-auto aspect-square mb-6 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-black/50 ring-1 ring-zinc-200/50 dark:ring-white/10">
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
          <Slider
            defaultValue={[0]}
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={seek}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-zinc-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={(e) => skip(-10, e)}
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
            onClick={(e) => skip(10, e)}
            className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <SkipForward size={20} />
          </button>
        </div>

        <div className="mt-6 flex justify-center">
          <button onClick={toggleSpeed} className="text-xs font-medium text-zinc-400 hover:text-zinc-900 dark:hover:text-white px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 transition-colors">
            {playbackRate}x Speed
          </button>
        </div>

        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      </div>
    );
  }

  // Mobile Drawer Mode
  return (
    <Drawer>
      {/* Visual triggers the drawer */}
      <DrawerTrigger asChild>
        <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] pb-safe cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
          {/* Mini Progress Bar */}
          <div className="relative h-1 w-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="absolute h-full bg-pfcu-primary"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
          </div>

          {/* Drag Handle Hint */}
          <div className="w-full flex justify-center -mt-2.5 mb-1 pb-1">
            <div className="w-12 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 shadow-sm" />
          </div>

          <div className="flex items-center gap-4 px-4 pb-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 shadow-sm relative">
              <div className={`absolute inset-0 bg-black/20 ${isPlaying ? 'block' : 'hidden'}`}>
                <div className="flex gap-0.5 items-end justify-center w-full h-full pb-3">
                  <div className="w-0.5 bg-white animate-[music-bar_0.6s_ease-in-out_infinite] h-3" />
                  <div className="w-0.5 bg-white animate-[music-bar_0.8s_ease-in-out_infinite] h-5" />
                  <div className="w-0.5 bg-white animate-[music-bar_1.0s_ease-in-out_infinite] h-2" />
                </div>
              </div>
              <img src={coverImage} alt={title} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white truncate">{title}</h3>
              <p className="text-xs text-pfcu-primary font-medium truncate opacity-90">{preacher}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={togglePlay}
                className="h-10 w-10 bg-pfcu-primary text-white rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all"
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
              </button>

              {/* Expand Hint */}
              <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <ChevronUp size={20} className="animate-pulse" />
              </button>
            </div>
          </div>
        </div>
      </DrawerTrigger>

      {/* Full Screen Player Content */}
      <DrawerContent className="h-[96vh] bg-white dark:bg-zinc-950 rounded-t-[2rem]">
        <div className="h-full flex flex-col p-6 max-w-md mx-auto w-full">

          {/* Drawer Handle / Close */}
          <div className="flex items-center justify-between mb-8">
            <DrawerClose asChild>
              <button className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                <ChevronDown size={28} />
              </button>
            </DrawerClose>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Now Playing</span>
            <button className="p-2 -mr-2 text-zinc-400">
              <MoreHorizontal size={24} />
            </button>
          </div>

          {/* Big Cover Art */}
          <div className="flex-1 flex items-center justify-center min-h-0 mb-8">
            <div className="aspect-square w-full max-h-[350px] rounded-3xl overflow-hidden shadow-2xl shadow-zinc-200 dark:shadow-black/50 ring-1 ring-zinc-100 dark:ring-white/5 relative bg-zinc-100">
              <img src={coverImage} alt={title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight mb-2">{title}</h2>
            <p className="text-lg text-pfcu-primary font-medium">{preacher}</p>
          </div>

          {/* Seek */}
          <div className="mb-8 space-y-3">
            <Slider
              defaultValue={[0]}
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={seek}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs font-medium text-zinc-400 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-between mb-12">
            <button onClick={toggleSpeed} className="w-10 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              {playbackRate}x
            </button>

            <div className="flex items-center gap-6">
              <button onClick={(e) => skip(-10, e)} className="p-2 text-zinc-900 dark:text-white hover:opacity-70 transition-opacity">
                <SkipBack size={32} strokeWidth={1.5} />
              </button>

              <button
                onClick={togglePlay}
                className="h-20 w-20 bg-pfcu-primary text-white rounded-full flex items-center justify-center shadow-xl shadow-pfcu-primary/30 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
              </button>

              <button onClick={(e) => skip(10, e)} className="p-2 text-zinc-900 dark:text-white hover:opacity-70 transition-opacity">
                <SkipForward size={32} strokeWidth={1.5} />
              </button>
            </div>

            <button onClick={handleDownload} className="w-10 flex justify-end text-zinc-400 hover:text-pfcu-primary transition-colors">
              <Download size={24} />
            </button>
          </div>
        </div>
      </DrawerContent>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </Drawer>
  );
};

export default SermonPlayer;
