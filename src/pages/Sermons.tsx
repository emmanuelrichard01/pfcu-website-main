import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SermonPlayer from "@/components/sermons/SermonPlayer";
import SermonList from "@/components/sermons/SermonList";
import { Sermon } from "@/types/sermons";
import { Search, Headphones, Mic, Music, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

const Sermons = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [filteredSermons, setFilteredSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSermons = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .order('sermon_date', { ascending: false });

        if (error) throw error;

        setSermons(data || []);
        setFilteredSermons(data || []);
        if (data && data.length > 0) setSelectedSermon(data[0]);
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
            (sermon.description && sermon.description.toLowerCase().includes(query))
        )
      );
    }
  }, [searchQuery, sermons]);

  const handleSermonSelect = (sermon: Sermon) => {
    setSelectedSermon(sermon);
    setShouldAutoPlay(false);
  };

  const handlePlaySermon = (sermon: Sermon) => {
    setSelectedSermon(sermon);
    setShouldAutoPlay(true);
  };

  const formatSermonDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-300">
      <MainLayout>

        {/* --- Cinematic Hero (Same as Departments/Giving) --- */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pfcu-primary/5 via-zinc-50/0 to-zinc-50/0 dark:from-pfcu-primary/10 dark:via-zinc-950/0 dark:to-zinc-950/0" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />

            {/* Floating Doodles */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute top-1/4 left-10 md:left-20 text-pfcu-primary/20 hidden lg:block"
            >
              <Headphones size={48} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="absolute top-1/3 right-10 md:right-20 text-blue-500/20 hidden lg:block"
            >
              <Mic size={56} />
            </motion.div>
          </div>

          <div className="container mx-auto max-w-5xl relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8">
                <Music size={14} className="text-pfcu-primary fill-pfcu-primary" />
                <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">Message Library</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-heading font-bold text-zinc-900 dark:text-white tracking-tight mb-8">
                Listen & <br />
                <span className="text-pfcu-primary relative">
                  Be Transformed.
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-pfcu-primary/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
                  </svg>
                </span>
              </h1>

              <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Dive into a collection of life-changing messages. Whether you missed a Sunday or want to re-listen, the word is just a click away.
              </p>
            </motion.div>
          </div>
        </section>

        {/* --- Search & Filter Bar --- */}
        <section className="sticky top-20 z-30 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 py-4 mb-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="relative w-full max-w-lg mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                placeholder="Search by title or preacher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-pfcu-primary/20 shadow-sm text-base"
              />
            </div>
          </div>
        </section>


        <div className="container mx-auto max-w-7xl px-4 md:px-8 pb-32">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Main Content: Sermon List */}
            <div className="flex-1">
              <div className="bg-white dark:bg-zinc-900/50 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 min-h-[500px]">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold font-heading text-zinc-900 dark:text-white">Recent Messages</h2>
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">{filteredSermons.length} found</span>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pfcu-primary" />
                  </div>
                ) : filteredSermons.length > 0 ? (
                  <SermonList
                    sermons={filteredSermons}
                    selectedSermonId={selectedSermon?.id}
                    onSelectSermon={handleSermonSelect}
                    onPlaySermon={handlePlaySermon}
                    formatSermonDate={formatSermonDate}
                  />
                ) : (
                  <div className="text-center py-24">
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="text-zinc-400" size={24} />
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400">No sermons found matching your search.</p>
                    <Button variant="link" onClick={() => setSearchQuery("")} className="text-pfcu-primary">Clear Search</Button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Player - Desktop Only */}
            <div className="hidden lg:block w-[350px] shrink-0 sticky top-32 h-[calc(100vh-140px)]">
              <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden h-full flex flex-col">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 text-center border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Now Playing</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  {selectedSermon ? (
                    <SermonPlayer
                      mode="sidebar"
                      title={selectedSermon.title}
                      preacher={selectedSermon.preacher}
                      date={formatSermonDate(selectedSermon.sermon_date)}
                      coverImage={selectedSermon.cover_image || ""}
                      audioUrl={selectedSermon.audio_url || ""}
                      autoPlay={shouldAutoPlay}
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center text-zinc-400 space-y-4">
                      <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <Headphones size={32} className="opacity-50" />
                      </div>
                      <p className="text-sm font-medium">Select a sermon from the list to start listening</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Player - Fixed Bottom */}
        {selectedSermon && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
            <SermonPlayer
              mode="card" // Will use new mini-player styling
              title={selectedSermon.title}
              preacher={selectedSermon.preacher}
              date={formatSermonDate(selectedSermon.sermon_date)}
              coverImage={selectedSermon.cover_image || ""}
              audioUrl={selectedSermon.audio_url || ""}
              autoPlay={shouldAutoPlay}
            />
          </div>
        )}

      </MainLayout>
    </div>
  );
};

export default Sermons;
