import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SermonPlayer from "@/components/sermons/SermonPlayer";
import SermonList from "@/components/sermons/SermonList";
import { Sermon } from "@/types/sermons";
import { Search, Headphones } from "lucide-react";

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
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <MainLayout>
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] pt-20">

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto pb-40 lg:pb-8">
            <div className="max-w-4xl mx-auto px-6 py-8">

              {/* Header - Clean & Simple */}
              <header className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-zinc-900 dark:text-white mb-1">
                  Sermons
                </h1>
                <p className="text-zinc-500 text-sm">
                  {sermons.length} messages available
                </p>
              </header>

              {/* Search - Minimal */}
              <div className="mb-8">
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-xl px-4 h-12 border border-transparent focus-within:border-zinc-300 dark:focus-within:border-zinc-700 transition-colors">
                  <Search size={18} className="text-zinc-400 mr-3 shrink-0" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sermons..."
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-zinc-400 hover:text-zinc-600 text-xs font-medium ml-2"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Sermon List */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-pfcu-primary border-t-transparent" />
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
                <div className="text-center py-16">
                  <p className="text-zinc-400 mb-4">No sermons found</p>
                  <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                    Clear search
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Player - Desktop Only */}
          <div className="hidden lg:flex w-[360px] h-full border-l border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex-col">
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
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-400">
                <Headphones size={32} className="mb-4 opacity-50" />
                <p className="text-sm">Select a sermon to listen</p>
              </div>
            )}
          </div>

          {/* Mobile Player - Fixed Bottom */}
          {selectedSermon && (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shadow-lg">
              <SermonPlayer
                mode="card"
                title={selectedSermon.title}
                preacher={selectedSermon.preacher}
                date={formatSermonDate(selectedSermon.sermon_date)}
                coverImage={selectedSermon.cover_image || ""}
                audioUrl={selectedSermon.audio_url || ""}
                autoPlay={shouldAutoPlay}
              />
            </div>
          )}

        </div>
      </MainLayout>
    </div>
  );
};

export default Sermons;
