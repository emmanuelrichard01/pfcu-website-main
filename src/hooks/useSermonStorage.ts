
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useSermonStorage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  /**
   * Upload a file to Supabase storage
   */
  const uploadFile = async (
    file: File, 
    bucket: string, 
    folder: string, 
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    try {
      // Create buckets if they don't exist (will be silently ignored if they exist)
      try {
        await supabase.storage.createBucket(bucket, {
          public: true
        });
      } catch (error) {
        console.log("Bucket might already exist:", error);
      }

      const filePath = `${folder}/${Date.now()}_${file.name}`;
      
      // Upload file to storage
      const { error, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true
        });
      
      if (error) throw error;
      
      // Manual progress tracking if provided
      if (onProgress) {
        onProgress(100);
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error("Error in uploadFile:", error);
      throw error;
    }
  };

  /**
   * Delete a file from Supabase storage
   */
  const deleteFile = async (fileUrl: string | null): Promise<boolean> => {
    if (!fileUrl) return true;
    
    try {
      const path = new URL(fileUrl).pathname.split('/').slice(-2).join('/');
      const { error } = await supabase.storage
        .from('sermons')
        .remove([path]);
      
      if (error) {
        console.warn("Error removing file:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.warn("Error parsing or removing file:", error);
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    isUploading,
    setIsUploading
  };
};
