
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
      // Create bucket if it doesn't exist
      try {
        const { data: bucketData, error: bucketError } = await supabase.storage.listBuckets();
        
        if (bucketError) {
          console.error("Error checking buckets:", bucketError);
          throw bucketError;
        }
        
        const bucketExists = bucketData?.some(b => b.name === bucket);
        
        if (!bucketExists) {
          const { error: createError } = await supabase.storage.createBucket(bucket, {
            public: true, // Make bucket public
            fileSizeLimit: 52428800 // 50MB
          });
          
          if (createError) {
            console.error("Error creating bucket:", createError);
            throw createError;
          }
          
          // Add a public policy to the bucket
          const { error: policyError } = await supabase.rpc('create_public_bucket_policy', {
            bucket_name: bucket
          });
          
          if (policyError) {
            console.warn("Error setting bucket policy (not critical):", policyError);
          }
        }
      } catch (error) {
        console.log("Bucket error (continuing anyway):", error);
      }

      const filePath = `${folder}/${Date.now()}_${file.name}`;
      
      // Upload file to storage with max cacheControl and public access
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
