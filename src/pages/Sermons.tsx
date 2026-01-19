
import { useState, useEffect, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SermonPlayer from "@/components/sermons/SermonPlayer";
import SermonSearch from "@/components/sermons/SermonSearch";
import SermonList from "@/components/sermons/SermonList";
import { Sermon } from "@/types/sermons";
import { Mic2, Sparkles } from "lucide-react";

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
    if (window.innerWidth < 1024) {
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
      {/* Modern Compact Hero */}
      <div className="relative bg-pfcu-dark pt-32 pb-16 md:py-36 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-pfcu-primary/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-pfcu-secondary/10 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-pfcu-secondary text-sm font-medium mb-6">
              <Mic2 size={14} />
              <span>Word of Life</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 tracking-tight">
              Sermon Archive
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Explore our collection of life-changing messages. Be inspired, challenged, and encouraged by the Word of God.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Main Content Area (Player + Recent) */}
          <div className="lg:col-span-12 xl:col-span-5 order-2 lg:order-1 xl:sticky xl:top-24 xl:self-start space-y-8">
            {/* Sticky Player Container */}
            <div className="sticky top-24 z-30">
              <div className="mb-4 flex items-center gap-2 text-pfcu-primary font-bold tracking-wide text-sm uppercase">
                <Sparkles size={16} />
                <span>Now Playing</span>
              </div>
              {selectedSermon && selectedSermon.audio_url ? (
                <SermonPlayer
                  title={selectedSermon.title}
                  preacher={selectedSermon.preacher}
                  date={selectedSermon.sermon_date ? formatSermonDate(selectedSermon.sermon_date) : undefined}
                  coverImage={selectedSermon.cover_image || undefined}
                  audioUrl={selectedSermon.audio_url}
                />
              ) : (
                <div className="bg-zinc-50 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-12 rounded-3xl text-center">
                  <h3 className="text-xl font-bold mb-2 text-muted-foreground">Select a Sermon</h3>
                  <p className="text-sm text-muted-foreground/70">
                    Choose from the list to start listening
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* List Area */}
          <div className="lg:col-span-12 xl:col-span-7 order-1 lg:order-2">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-heading font-bold text-pfcu-dark dark:text-white">Latest Messages</h2>
                <p className="text-muted-foreground mt-1">Found {filteredSermons.length} sermons</p>
              </div>
            </div>

            <SermonSearch
              searchQuery={searchQuery}
              onChange={handleSearchChange}
              onClear={clearSearch}
              inputRef={searchInputRef}
            />

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-10 h-10 border-4 border-pfcu-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground animate-pulse">Loading library...</p>
              </div>
            ) : filteredSermons.length === 0 ? (
              <div className="text-center py-24 border rounded-3xl bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="text-xl font-semibold mb-2">No Sermons Found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  We couldn't find any sermons matching "{searchQuery}". Try adjusting your keywords.
                </p>
                <Button onClick={clearSearch} variant="outline" className="rounded-full">Clear Search</Button>
              </div>
            ) : (
              <SermonList
                sermons={filteredSermons}
                selectedSermonId={selectedSermon?.id}
                onSelectSermon={handleSermonSelect}
                formatSermonDate={formatSermonDate}
              />
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default Sermons;
