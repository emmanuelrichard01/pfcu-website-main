
import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { motion } from "framer-motion";

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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative aspect-square md:aspect-auto">
          <img 
            src={coverImage || "/placeholder.svg"} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 md:hidden">
            <div className="text-white">
              <h3 className="text-lg font-bold line-clamp-1">{title}</h3>
              <p className="text-sm opacity-90">{preacher}</p>
              {date && <p className="text-xs opacity-75">{date}</p>}
            </div>
          </div>
        </div>
        
        <div className="md:w-2/3 p-5 flex flex-col">
          <div className="hidden md:block mb-4">
            <h3 className="text-xl font-bold mb-1">{title}</h3>
            <p className="text-gray-600">{preacher}</p>
            {date && <p className="text-sm text-gray-500">{date}</p>}
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500 w-12 text-right">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={seek}
                className="flex-1 h-2 accent-pfcu-purple cursor-pointer rounded-full"
              />
              <span className="text-xs text-gray-500 w-12">
                {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => skip(-10)} 
                  className="text-gray-500 hover:text-pfcu-purple transition-colors"
                >
                  <SkipBack size={20} />
                </button>
                
                <motion.button
                  onClick={togglePlay}
                  className="bg-pfcu-purple h-12 w-12 rounded-full flex items-center justify-center text-white shadow-md hover:bg-pfcu-dark transition-colors"
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: isPlaying ? [1, 1.05, 1] : 1,
                    transition: { 
                      duration: 0.3, 
                      repeat: isPlaying ? Infinity : 0, 
                      repeatDelay: 2 
                    }
                  }}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                </motion.button>
                
                <button 
                  onClick={() => skip(10)} 
                  className="text-gray-500 hover:text-pfcu-purple transition-colors"
                >
                  <SkipForward size={20} />
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="text-gray-500 hover:text-pfcu-purple transition-colors"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 accent-pfcu-purple cursor-pointer"
                />
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
