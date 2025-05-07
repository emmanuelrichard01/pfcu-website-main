
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSermonStorage } from "./useSermonStorage";
import { Sermon } from "@/types/sermons";
import * as sermonService from "@/services/sermonService";

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
      const { data, count: rowCount } = await sermonService.fetchSermons();
      
      setSermons(data);
      setCount(rowCount);
        
      // Cache sermons in localStorage for fallback
      localStorage.setItem("pfcu_sermons", JSON.stringify(data));
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
      await sermonService.addSermon(sermon);
      
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
      await sermonService.updateSermon(id, sermon);
      
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
      const { sermon } = await sermonService.deleteSermon(id);
      
      // Delete associated files from storage if they exist
      if (sermon) {
        if (sermon.audio_url) {
          await deleteFile(sermon.audio_url);
        }
        
        if (sermon.cover_image) {
          await deleteFile(sermon.cover_image);
        }
      }
      
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

  // Fetch sermons on component mount
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
