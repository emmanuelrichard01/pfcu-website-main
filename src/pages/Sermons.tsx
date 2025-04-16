
import { useState, useEffect, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  FileText, 
  Search, 
  Play, 
  Download, 
  Music, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

// Type definition for sermon data from Supabase
interface Sermon {
  id: string;
  title: string;
  preacher: string;
  description: string | null;
  sermon_date: string;
  duration: string | null;
  cover_image: string | null;
  audio_url: string | null;
}

interface AudioPlayerProps {
  src: string;
  title: string;
  preacher: string;
  coverImage?: string | null;
  onClose: () => void;
}

const AudioPlayer = ({ src, title, preacher, coverImage, onClose }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

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

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newVolume = parseFloat(e.target.value);
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

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 border-t"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{ duration: 0.3 }}
    >
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-pfcu-purple/10 rounded flex-shrink-0">
            {coverImage ? (
              <img src={coverImage} alt={title} className="w-full h-full object-cover rounded" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music className="w-6 h-6 text-pfcu-purple" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <div className="truncate">
                <h4 className="font-medium text-sm truncate">{title}</h4>
                <p className="text-xs text-gray-500 truncate">{preacher}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={onClose}
              >
                &times;
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleTimeChange}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <span className="text-xs text-gray-500">{formatTime(duration)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={skipBackward}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="default" 
              size="icon" 
              className="h-10 w-10 rounded-full bg-pfcu-purple hover:bg-pfcu-dark"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={skipForward}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            {src && (
              <a 
                href={src} 
                download
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-2"
              >
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SermonCard = ({ sermon }: { sermon: Sermon }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card 
        className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`h-40 bg-pfcu-purple/10 relative overflow-hidden transition-all duration-300 ${isHovered ? 'bg-pfcu-purple/20' : ''}`}>
          {sermon.cover_image ? (
            <>
              <img 
                src={sermon.cover_image} 
                alt={sermon.title}
                className="h-full w-full object-cover transition-all duration-500"
                style={{
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                }}
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </>
          ) : (
            <FileText className={`w-16 h-16 text-pfcu-purple absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isHovered ? 'scale-110' : ''}`} />
          )}
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{sermon.title}</CardTitle>
          </div>
          <CardDescription className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(sermon.sermon_date).toLocaleDateString()}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2 flex-grow">
          <p className="text-gray-600 text-sm line-clamp-3">{sermon.description || "No description available"}</p>
        </CardContent>
        <CardFooter className="pt-0 flex justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium">{sermon.preacher}</span>
            {sermon.duration && <span className="ml-2">· {sermon.duration}</span>}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const Sermons = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentSermon, setCurrentSermon] = useState<Sermon | null>(null);
  
  useEffect(() => {
    const fetchSermons = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .order('sermon_date', { ascending: false });
        
        if (error) {
          console.error("Error fetching sermons:", error);
          throw error;
        }
        
        if (data) {
          setSermons(data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSermons();
  }, []);
  
  const filteredSermons = searchTerm 
    ? sermons.filter(sermon => 
        sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        sermon.preacher.toLowerCase().includes(searchTerm.toLowerCase()))
    : sermons;

  return (
    <MainLayout>
      <div className="bg-pfcu-purple text-white py-20">
        <div className="container text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-display font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Sermons Archive
          </motion.h1>
          <motion.p 
            className="text-xl max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Listen to inspiring messages from our fellowship leaders
          </motion.p>
          <motion.p
            className="font-semibold text-2xl text-pfcu-gold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            "Many but one in Christ"
          </motion.p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold">Latest Sermons</h2>
              <div className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full">
                Tenure: Realignment
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4 w-full md:w-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <a 
                href="https://open.spotify.com/show/example" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden md:flex items-center space-x-2 text-green-600 hover:text-green-700"
              >
                <Music className="h-5 w-5" />
                <span>Listen on Spotify</span>
              </a>
              
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  className="pl-9"
                  placeholder="Search sermons..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </motion.div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-pfcu-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading sermons...</p>
            </div>
          ) : filteredSermons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSermons.map((sermon) => (
                <div key={sermon.id} onClick={() => setCurrentSermon(sermon)} className="cursor-pointer">
                  <SermonCard sermon={sermon} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              {searchTerm ? (
                <p className="text-gray-500">No sermons match your search. Try a different keyword.</p>
              ) : (
                <p className="text-gray-500">No sermons available at the moment. Check back later.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {currentSermon && currentSermon.audio_url && (
        <AudioPlayer 
          src={currentSermon.audio_url}
          title={currentSermon.title}
          preacher={currentSermon.preacher}
          coverImage={currentSermon.cover_image}
          onClose={() => setCurrentSermon(null)}
        />
      )}
    </MainLayout>
  );
};

export default Sermons;
