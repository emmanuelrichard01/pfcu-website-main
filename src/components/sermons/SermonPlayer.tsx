
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, RotateCcw, RotateCw } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SermonPlayerProps {
  audioUrl: string;
  title: string;
  preacher: string;
  coverImage?: string | null;
}

const SermonPlayer = ({ audioUrl, title, preacher, coverImage }: SermonPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (values: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = values[0];
    setCurrentTime(values[0]);
  };

  const handleVolumeChange = (values: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = values[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume || 1;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.min(Math.max(currentTime + seconds, 0), duration);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <motion.div 
      className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${isExpanded ? 'max-w-4xl mx-auto' : 'max-w-2xl mx-auto'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <div className={`flex ${isExpanded ? 'flex-col md:flex-row' : 'flex-col'} overflow-hidden`}>
        {/* Cover Image */}
        <motion.div 
          layout
          className={`relative ${isExpanded ? 'md:w-1/2 aspect-square md:aspect-auto' : 'aspect-video'} bg-pfcu-light overflow-hidden`}
        >
          {coverImage ? (
            <img 
              src={coverImage} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pfcu-purple/80 to-pfcu-dark">
              <div className="text-center p-4">
                <h3 className="text-white text-xl font-medium font-display">{title}</h3>
                <p className="text-white/80 text-sm">{preacher}</p>
              </div>
            </div>
          )}
          
          {/* Big Play Button in Center */}
          <AnimatePresence>
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
              </div>
            ) : !isPlaying && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm cursor-pointer"
                onClick={togglePlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="h-8 w-8 text-white fill-white" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Controls */}
        <motion.div 
          layout
          className={`${isExpanded ? 'md:w-1/2' : 'w-full'} p-4 md:p-6`}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
            <p className="text-gray-500 text-sm">by {preacher}</p>
          </div>
          
          <div className="space-y-4">
            {/* Progress bar */}
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                min={0}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            {/* Main controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => skip(-10)}
                  className="rounded-full hover:bg-pfcu-light text-pfcu-purple"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span className="sr-only">Rewind 10 seconds</span>
                </Button>
                
                <Button
                  variant="default"
                  size="icon"
                  onClick={togglePlay}
                  className="rounded-full bg-pfcu-purple text-white hover:bg-pfcu-dark mx-2 h-12 w-12"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => skip(10)}
                  className="rounded-full hover:bg-pfcu-light text-pfcu-purple"
                >
                  <RotateCw className="h-5 w-5" />
                  <span className="sr-only">Forward 10 seconds</span>
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    onMouseEnter={() => setShowVolumeControl(true)}
                    onMouseLeave={() => setShowVolumeControl(false)}
                    className="rounded-full hover:bg-pfcu-light text-pfcu-purple"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    <span className="sr-only">{isMuted ? 'Unmute' : 'Mute'}</span>
                  </Button>
                  
                  <AnimatePresence>
                    {showVolumeControl && (
                      <motion.div 
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-white shadow-lg rounded-full w-24"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        onMouseEnter={() => setShowVolumeControl(true)}
                        onMouseLeave={() => setShowVolumeControl(false)}
                      >
                        <Slider
                          value={[isMuted ? 0 : volume]}
                          min={0}
                          max={1}
                          step={0.01}
                          onValueChange={handleVolumeChange}
                          className="w-full"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="rounded-full hover:bg-pfcu-light text-pfcu-purple"
                >
                  {isExpanded ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                  <span className="sr-only">{isExpanded ? 'Minimize' : 'Maximize'}</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SermonPlayer;
