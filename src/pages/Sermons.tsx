
import { useState, useEffect } from "react";
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
import { FileText, Search, Play, Download, Music } from "lucide-react";
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
        className="overflow-hidden transition-all duration-300 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`h-40 bg-pfcu-purple/10 flex items-center justify-center transition-all duration-300 ${isHovered ? 'bg-pfcu-purple/20' : ''}`}>
          {sermon.cover_image ? (
            <img 
              src={sermon.cover_image} 
              alt={sermon.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <FileText className={`w-16 h-16 text-pfcu-purple transition-all duration-300 ${isHovered ? 'scale-110' : ''}`} />
          )}
        </div>
        <CardHeader>
          <CardTitle>{sermon.title}</CardTitle>
          <CardDescription>{sermon.preacher}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{sermon.description || "No description available"}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{new Date(sermon.sermon_date).toLocaleDateString()}</span>
            <span>{sermon.duration || "N/A"}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            className="bg-pfcu-purple hover:bg-pfcu-dark"
            disabled={!sermon.audio_url}
          >
            <Play className="mr-2 h-4 w-4" /> Listen
          </Button>
          <Button 
            variant="outline"
            disabled={!sermon.audio_url}
          >
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const Sermons = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
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
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <a 
                href="https://open.spotify.com/show/example" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-green-600 hover:text-green-700"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredSermons.map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} />
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
    </MainLayout>
  );
};

export default Sermons;
