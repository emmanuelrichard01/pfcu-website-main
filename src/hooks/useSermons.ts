
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Sermon {
  id: string;
  title: string;
  preacher: string;
  sermon_date: string;
  description: string | null;
  duration: string | null;
  audio_url: string | null;
  cover_image: string | null;
  created_at: string;
}

export const useSermons = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSermons = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setSermons(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching sermons",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteSermon = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sermons')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Sermon deleted successfully",
      });
      
      // Refresh the sermons list
      fetchSermons();
    } catch (error: any) {
      toast({
        title: "Error deleting sermon",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Create storage bucket for sermons if it doesn't exist
  useEffect(() => {
    const createSermonsBucket = async () => {
      try {
        // Check if bucket already exists
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        if (bucketsError) throw bucketsError;
        
        const sermonsBucketExists = buckets.some(bucket => bucket.name === 'sermons');
        
        if (!sermonsBucketExists) {
          const { error } = await supabase.storage.createBucket('sermons', {
            public: true
          });
          
          if (error) throw error;
          
          console.log("Created sermons bucket");
        }
      } catch (error: any) {
        console.error("Error setting up storage:", error.message);
      }
    };
    
    createSermonsBucket();
    fetchSermons();
  }, []);

  return {
    sermons,
    loading,
    fetchSermons,
    deleteSermon
  };
};
