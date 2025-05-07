import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useSermonStorage } from "./useSermonStorage";

export interface Sermon {
  id: string;
  title: string;
  preacher: string;
  sermon_date: string;
  description: string | null;
  duration: string | null;
  audio_url: string | null;
  cover_image: string | null;
  created_at: string;
  updated_at?: string;
}

export const useSermons = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const { toast } = useToast();
  const { uploadFile, deleteFile } = useSermonStorage();

  /**
   * Fetch all sermons from the database
   */
  const fetchSermons = async () => {
    setLoading(true);
    try {
      const { data, error, count: rowCount } = await supabase
        .from('sermons')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });
          
      if (error) {
        console.error("Supabase query error:", error);
        throw error;
      }
      
      setSermons(data || []);
      setCount(rowCount || 0);
        
      // Cache sermons in localStorage for fallback
      localStorage.setItem("pfcu_sermons", JSON.stringify(data || []));
    } catch (error: any) {
      console.error("Error in fetchSermons:", error);
      
      // Attempt to load from cache if available
      const storedSermons = localStorage.getItem("pfcu_sermons");
      if (storedSermons) {
        const parsedData = JSON.parse(storedSermons);
        setSermons(parsedData || []);
        setCount(parsedData?.length || 0);
      } else {
        toast({
          title: "Error fetching sermons",
          description: error.message,
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a sermon to the database
   */
  const addSermon = async (sermon: Omit<Sermon, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('sermons')
        .insert(sermon)
        .select('*')
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Sermon added successfully",
      });
      
      // Refresh sermons list
      fetchSermons();
      
      return true;
    } catch (error: any) {
      console.error("Error in addSermon:", error);
      toast({
        title: "Error adding sermon",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  /**
   * Update a sermon in the database
   */
  const updateSermon = async (id: string, sermon: Partial<Sermon>) => {
    try {
      // Use direct update
      const { error } = await supabase
        .from('sermons')
        .update(sermon)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Sermon updated successfully",
      });
      
      // Refresh sermons list
      fetchSermons();
      
      return true;
    } catch (error: any) {
      console.error("Error in updateSermon:", error);
      toast({
        title: "Error updating sermon",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  /**
   * Delete a sermon from the database
   */
  const deleteSermon = async (id: string) => {
    try {
      // Get the sermon to find associated files
      const { data: sermon, error: fetchError } = await supabase
        .from('sermons')
        .select('audio_url, cover_image')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.warn("Could not fetch sermon before deletion:", fetchError);
      }
      
      // Delete associated files from storage if they exist
      if (sermon) {
        if (sermon.audio_url) {
          await deleteFile(sermon.audio_url);
        }
        
        if (sermon.cover_image) {
          await deleteFile(sermon.cover_image);
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
      
      return true;
    } catch (error: any) {
      console.error("Error in deleteSermon:", error);
      toast({
        title: "Error deleting sermon",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  // Remove the bucket creation code and just fetch sermons on component mount
  useEffect(() => {
    fetchSermons();
  }, []);

  return {
    sermons,
    loading,
    count,
    fetchSermons,
    addSermon,
    updateSermon,
    deleteSermon,
    uploadFile,
  };
};
