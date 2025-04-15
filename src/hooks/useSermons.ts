
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
  const [count, setCount] = useState(0);
  const { toast } = useToast();

  const fetchSermons = async () => {
    setLoading(true);
    try {
      const { data, error, count: totalCount } = await supabase
        .from('sermons')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setSermons(data || []);
      if (totalCount !== null) {
        setCount(totalCount);
      }
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
      // Get the sermon to find associated files
      const { data: sermon, error: fetchError } = await supabase
        .from('sermons')
        .select('audio_url, cover_image')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Delete associated files from storage if they exist
      if (sermon) {
        if (sermon.audio_url) {
          const audioPath = new URL(sermon.audio_url).pathname.split('/').slice(-2).join('/');
          await supabase.storage.from('sermons').remove([audioPath]);
        }
        
        if (sermon.cover_image) {
          const imagePath = new URL(sermon.cover_image).pathname.split('/').slice(-2).join('/');
          await supabase.storage.from('sermons').remove([imagePath]);
        }
      }
      
      // Delete the sermon record
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
    const createSermonsBuckets = async () => {
      try {
        // Check if buckets already exist
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
    
    createSermonsBuckets();
    fetchSermons();
  }, []);

  return {
    sermons,
    loading,
    count,
    fetchSermons,
    deleteSermon
  };
};
