
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SermonPlayerProps {
  title: string;
  preacher: string;
  date?: string;
  audioUrl: string;
  coverImage?: string;
}

const SermonPlayer = ({ title, preacher, date, audioUrl, coverImage }: SermonPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setCurrentTime(audio.currentTime);
    
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, [audioRef]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };
  
  const handleSkipBack = () => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime -= 10;
  };
  
  const handleSkipForward = () => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime += 10;
  };
  
  const defaultCover = "/placeholder.svg";
  const formattedDate = date || "";

  return (
    <motion.div 
      className="overflow-hidden rounded-2xl shadow-xl bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-64 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pfcu-purple/80 to-pfcu-dark/90 z-10"></div>
        {coverImage && (
          <img 
            src={coverImage} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        )}
        
        <motion.div 
          className="z-20 flex flex-col items-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <img 
              src={coverImage || defaultCover} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <motion.button
            className="rounded-full bg-white text-pfcu-purple hover:bg-pfcu-gold hover:text-white w-14 h-14 flex items-center justify-center shadow-lg"
            onClick={togglePlay}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </motion.button>
        </motion.div>
      </div>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <div className="p-6">
        <h2 className="text-xl font-bold mb-1 line-clamp-1">{title}</h2>
        <p className="text-gray-600 mb-4">{preacher} {formattedDate && `• ${formattedDate}`}</p>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">{formatTime(currentTime)}</span>
            <span className="text-xs font-medium text-gray-500">{formatTime(duration)}</span>
          </div>
          
          <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-pfcu-purple to-pfcu-gold" 
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Seek audio playback position"
            />
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleMute}
              className="text-gray-600 hover:text-pfcu-purple"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSkipBack}
                className="text-gray-600 hover:text-pfcu-purple hover:border-pfcu-purple rounded-full h-8 w-8 p-0 flex items-center justify-center"
                aria-label="Skip back 10 seconds"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <motion.button 
                onClick={togglePlay}
                className="rounded-full bg-pfcu-purple text-white hover:bg-pfcu-gold w-12 h-12 flex items-center justify-center shadow-md"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </motion.button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSkipForward}
                className="text-gray-600 hover:text-pfcu-purple hover:border-pfcu-purple rounded-full h-8 w-8 p-0 flex items-center justify-center"
                aria-label="Skip forward 10 seconds"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="w-5"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SermonPlayer;
