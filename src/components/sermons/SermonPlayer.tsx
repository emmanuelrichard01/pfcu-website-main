
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface SermonPlayerProps {
  title: string;
  preacher: string;
  date: string;
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-64 bg-pfcu-purple flex items-center justify-center">
        {coverImage ? (
          <img 
            src={coverImage} 
            alt={title} 
            className="w-full h-full object-cover absolute inset-0 opacity-25"
          />
        ) : (
          <div className="absolute inset-0 bg-pfcu-purple opacity-50"></div>
        )}
        <div className="w-48 h-48 bg-white rounded-lg shadow-lg overflow-hidden z-10">
          <img 
            src={coverImage || defaultCover} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Button 
            onClick={togglePlay}
            className="rounded-full bg-white text-pfcu-purple hover:bg-pfcu-gold hover:text-white w-16 h-16 flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 z-20"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8 ml-1" />
            )}
          </Button>
        </div>
      </div>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <div className="p-4">
        <h2 className="text-xl font-bold mb-1">{title}</h2>
        <p className="text-gray-600 mb-2">{preacher} • {date}</p>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
            <span className="text-xs text-gray-500">{formatTime(duration)}</span>
          </div>
          
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          
          <div className="flex items-center justify-between mt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSkipBack}
                aria-label="Skip back 10 seconds"
              >
                <SkipBack className="h-5 w-5" />
                <span className="text-xs ml-1">10s</span>
              </Button>
              
              <Button 
                onClick={togglePlay}
                className="rounded-full bg-pfcu-purple text-white hover:bg-pfcu-gold w-10 h-10 flex items-center justify-center"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSkipForward}
                aria-label="Skip forward 10 seconds"
              >
                <span className="text-xs mr-1">10s</span>
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="w-5"></div> {/* Placeholder for balance */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SermonPlayer;
