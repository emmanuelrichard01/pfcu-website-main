
import { useState, useEffect, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Search, User } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SermonPlayer from "@/components/sermons/SermonPlayer";

interface Sermon {
  id: string;
  title: string;
  preacher: string;
  sermon_date: string;
  description: string | null;
  duration: string | null;
  audio_url: string | null;
  cover_image: string | null;
}

const Sermons = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [filteredSermons, setFilteredSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  const { toast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSermons = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .order('sermon_date', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setSermons(data || []);
        setFilteredSermons(data || []);
        
        // Select the first sermon by default if available
        if (data && data.length > 0 && !selectedSermon) {
          setSelectedSermon(data[0]);
        }
      } catch (error: any) {
        toast({
          title: "Error loading sermons",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSermons();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSermons(sermons);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredSermons(
        sermons.filter(
          (sermon) =>
            sermon.title.toLowerCase().includes(query) ||
            sermon.preacher.toLowerCase().includes(query) ||
            (sermon.description &&
              sermon.description.toLowerCase().includes(query))
        )
      );
    }
  }, [searchQuery, sermons]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleSermonSelect = (sermon: Sermon) => {
    setSelectedSermon(sermon);
    
    // Scroll to player on mobile
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatSermonDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMMM d, yyyy");
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <MainLayout>
      <motion.div
        className="bg-pfcu-light py-16 md:py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-center mb-6 animate-fade-in">
            Sermons
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto text-gray-700 animate-fade-in">
            Listen to our weekly sermons and be blessed by the Word of God.
          </p>
        </div>
      </motion.div>

      <div className="container mx-auto py-12 px-4">
        <div className="lg:flex gap-8">
          {/* Sermon Player - Takes up full width on mobile, 1/3 on desktop */}
          <div className="lg:w-1/3 mb-8 lg:mb-0 lg:sticky lg:top-24 lg:self-start">
            {selectedSermon && selectedSermon.audio_url ? (
              <SermonPlayer
                title={selectedSermon.title}
                preacher={selectedSermon.preacher}
                date={selectedSermon.sermon_date ? formatSermonDate(selectedSermon.sermon_date) : undefined}
                coverImage={selectedSermon.cover_image || undefined}
                audioUrl={selectedSermon.audio_url}
              />
            ) : (
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <h3 className="text-xl font-semibold mb-2">No Sermon Selected</h3>
                <p className="text-gray-600">
                  Please select a sermon from the list to listen.
                </p>
              </div>
            )}
          </div>

          {/* Sermon List - Takes up full width on mobile, 2/3 on desktop */}
          <div className="lg:w-2/3">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search sermons by title, preacher, or keywords..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-10 py-6 h-auto"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={clearSearch}
                >
                  ✕
                </Button>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-pfcu-purple border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredSermons.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No Sermons Found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any sermons matching your search.
                </p>
                <Button onClick={clearSearch}>Clear Search</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredSermons.map((sermon) => (
                  <Card
                    key={sermon.id}
                    className={`overflow-hidden transition-all cursor-pointer hover:shadow-md ${
                      selectedSermon?.id === sermon.id ? "ring-2 ring-pfcu-purple" : ""
                    }`}
                    onClick={() => handleSermonSelect(sermon)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between items-start">
                        <div className="truncate text-lg">{sermon.title}</div>
                      </CardTitle>
                      
                      <CardDescription className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4" />
                        {formatSermonDate(sermon.sermon_date)}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      {sermon.description && (
                        <p className="text-gray-700 line-clamp-2 text-sm">
                          {sermon.description}
                        </p>
                      )}
                    </CardContent>
                    
                    <CardFooter className="flex justify-between items-center pt-0">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        {sermon.preacher}
                      </div>
                      
                      {sermon.duration && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          {sermon.duration}
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Sermons;
