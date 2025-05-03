
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

interface SermonPlayerProps {
  title: string;
  preacher: string;
  coverImage?: string;
  audioUrl: string;
}

const SermonPlayer = ({ title, preacher, coverImage, audioUrl }: SermonPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bufferingProgress, setBufferingProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number>();

  // Format time in MM:SS
  const formatTime = (time: number) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    return "0:00";
  };

  // Load and handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    setLoading(true);
    setError(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setBufferingProgress(0);

    // Simulate loading progress while waiting for the audio to load
    let progressInterval: NodeJS.Timeout;
    progressInterval = setInterval(() => {
      setBufferingProgress(prev => {
        if (prev < 90) return prev + Math.random() * 10;
        return prev;
      });
    }, 500);

    const handleCanPlay = () => {
      setLoading(false);
      setBufferingProgress(100);
      clearInterval(progressInterval);
      setDuration(audio.duration);
    };

    const handleLoadError = () => {
      setLoading(false);
      setBufferingProgress(0);
      clearInterval(progressInterval);
      setError("Failed to load sermon audio. Please try again.");
    };

    const handleTimeUpdate = () => {
      if (audio.currentTime && audio.duration) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const handleProgress = () => {
      if (audio.buffered.length > 0) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        const duration = audio.duration;
        const progress = (bufferedEnd / duration) * 100;
        setBufferingProgress(progress);
      }
    };

    audio.addEventListener("canplaythrough", handleCanPlay);
    audio.addEventListener("error", handleLoadError);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("progress", handleProgress);

    return () => {
      clearInterval(progressInterval);
      audio.removeEventListener("canplaythrough", handleCanPlay);
      audio.removeEventListener("error", handleLoadError);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("progress", handleProgress);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (loading) return;
    
    const isAudioPlaying = isPlaying;
    setIsPlaying(!isAudioPlaying);

    if (!isAudioPlaying) {
      audioRef.current.play();
      animationRef.current = requestAnimationFrame(updateProgress);
    } else {
      audioRef.current.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  };

  const updateProgress = () => {
    if (!audioRef.current) return;
    
    setCurrentTime(audioRef.current.currentTime);
    animationRef.current = requestAnimationFrame(updateProgress);
  };

  const handleTimeChange = (value: number[]) => {
    if (!audioRef.current || loading) return;
    
    audioRef.current.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    
    const newVolume = value[0];
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    audioRef.current.muted = newMuteState;
  };
  
  const jumpBackward = () => {
    if (!audioRef.current || loading) return;
    
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    setCurrentTime(audioRef.current.currentTime);
  };
  
  const jumpForward = () => {
    if (!audioRef.current || loading) return;
    
    audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10);
    setCurrentTime(audioRef.current.currentTime);
  };

  return (
    <Card className="w-full overflow-hidden shadow-xl rounded-xl border-pfcu-purple/10 hover:border-pfcu-purple/30 transition-all duration-300 transform hover:scale-[1.01]">
      <CardContent className="p-0">
        {/* Audio Element */}
        <audio ref={audioRef} src={audioUrl} preload="metadata" />

        {/* Cover Image */}
        <div className="relative w-full aspect-square bg-gradient-to-br from-pfcu-dark to-pfcu-purple overflow-hidden">
          {coverImage ? (
            <motion.img 
              src={coverImage} 
              alt={`${title} cover`} 
              className="w-full h-full object-cover"
              initial={{ scale: 1.05, opacity: 0.9 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pfcu-dark to-pfcu-purple">
              <motion.span 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-white text-6xl font-bold"
              >
                {title.charAt(0)}
              </motion.span>
            </div>
          )}
          
          <AnimatePresence>
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center"
              >
                <Loader2 className="w-12 h-12 text-pfcu-gold animate-spin mb-4" />
                <p className="text-white text-lg font-medium">Loading Audio...</p>
                <div className="w-3/4 mt-4">
                  <Progress value={bufferingProgress} className="h-2 bg-gray-700" />
                  <p className="text-center text-sm text-gray-300 mt-2">{Math.round(bufferingProgress)}%</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center"
              >
                <div className="text-white text-center p-4">
                  <p className="mb-4 text-lg">{error}</p>
                  <Button 
                    variant="outline"
                    className="border-white text-white bg-pfcu-purple/40 hover:bg-pfcu-purple hover:text-white"
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.load();
                        setLoading(true);
                        setError(null);
                      }
                    }}
                  >
                    Retry
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="p-6 bg-gradient-to-b from-pfcu-dark to-black text-white">
          {/* Title and Preacher */}
          <div className="mb-6">
            <h3 className="font-bold text-xl truncate text-pfcu-gold">{title}</h3>
            <p className="text-sm text-gray-300">{preacher}</p>
          </div>

          {/* Progress Slider */}
          <div className="mb-6">
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={0.1}
              onValueChange={handleTimeChange}
              disabled={loading || !!error}
              className={`${loading || error ? 'opacity-50' : ''}`}
            />
            <div className="flex justify-between text-xs text-gray-300 pt-2">
              <span className="font-mono">{formatTime(currentTime)}</span>
              <span className="font-mono">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={jumpBackward}
                disabled={loading || !!error}
                className="text-white hover:bg-pfcu-purple/30 transition-transform hover:scale-110"
              >
                <SkipBack size={20} />
              </Button>

              <Button 
                size="icon" 
                className="rounded-full w-12 h-12 bg-pfcu-gold text-pfcu-dark hover:bg-pfcu-gold/80 transition-all hover:scale-110 shadow-lg"
                onClick={togglePlayPause}
                disabled={loading || !!error}
              >
                {isPlaying ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} className="ml-1" />
                )}
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={jumpForward}
                disabled={loading || !!error}
                className="text-white hover:bg-pfcu-purple/30 transition-transform hover:scale-110"
              >
                <SkipForward size={20} />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-pfcu-purple/30"
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SermonPlayer;
