
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";

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

    const handleCanPlay = () => {
      setLoading(false);
      setDuration(audio.duration);
    };

    const handleLoadError = () => {
      setLoading(false);
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

    audio.addEventListener("canplaythrough", handleCanPlay);
    audio.addEventListener("error", handleLoadError);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlay);
      audio.removeEventListener("error", handleLoadError);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      
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
    <Card className="w-full overflow-hidden shadow-lg">
      <CardContent className="p-0">
        {/* Audio Element */}
        <audio ref={audioRef} src={audioUrl} preload="metadata" />

        {/* Cover Image */}
        <div className="relative w-full aspect-square bg-gray-200">
          {coverImage ? (
            <img 
              src={coverImage} 
              alt={`${title} cover`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-pfcu-purple">
              <span className="text-white text-4xl font-bold">{title.charAt(0)}</span>
            </div>
          )}
          
          {loading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-pfcu-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-center p-4">
                <p className="mb-2">{error}</p>
                <Button 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-pfcu-purple"
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
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 bg-pfcu-dark text-white">
          {/* Title and Preacher */}
          <div className="mb-4">
            <h3 className="font-bold truncate">{title}</h3>
            <p className="text-sm text-gray-300">{preacher}</p>
          </div>

          {/* Progress Slider */}
          <div className="mb-4">
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={0.1}
              onValueChange={handleTimeChange}
              disabled={loading || !!error}
              className={`${loading || error ? 'opacity-50' : ''}`}
            />
            <div className="flex justify-between text-xs text-gray-300">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={jumpBackward}
                disabled={loading || !!error}
                className="text-white hover:bg-pfcu-purple/30"
              >
                <SkipBack size={20} />
              </Button>

              <Button 
                size="icon" 
                className="rounded-full bg-pfcu-gold text-pfcu-dark hover:bg-pfcu-gold/80"
                onClick={togglePlayPause}
                disabled={loading || !!error}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={jumpForward}
                disabled={loading || !!error}
                className="text-white hover:bg-pfcu-purple/30"
              >
                <SkipForward size={20} />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
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
                className="w-20"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SermonPlayer;
