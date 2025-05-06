
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
      setIsUploading(true);
      
      // First, ensure the bucket exists
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(b => b.name === bucket);
        
        if (!bucketExists) {
          const { error } = await supabase.storage.createBucket(bucket, {
            public: true,
            fileSizeLimit: 52428800 // 50MB
          });
          
          if (error) {
            console.error("Error creating bucket:", error);
            throw new Error(`Failed to create storage bucket: ${error.message}`);
          }
          console.log(`Bucket ${bucket} created successfully`);
        }
      } catch (error: any) {
        console.warn("Error checking bucket:", error);
        // Continue anyway, as the bucket might already exist
      }

      const filePath = `${folder}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      
      console.log(`Uploading file to ${bucket}/${filePath}`);
      
      // Upload file to storage
      const { error, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type
        });
      
      if (error) {
        console.error("Upload error:", error);
        throw error;
      }
      
      // Manual progress tracking if provided
      if (onProgress) {
        onProgress(100);
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error: any) {
      console.error("Error in uploadFile:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Delete a file from Supabase storage
   */
  const deleteFile = async (fileUrl: string | null): Promise<boolean> => {
    if (!fileUrl) return true;
    
    try {
      const url = new URL(fileUrl);
      const pathParts = url.pathname.split('/');
      const bucket = pathParts[1]; // The bucket name should be after the first slash
      const path = pathParts.slice(2).join('/'); // The rest is the file path
      
      console.log(`Deleting file from bucket: ${bucket}, path: ${path}`);
      
      const { error } = await supabase.storage
        .from(bucket)
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
