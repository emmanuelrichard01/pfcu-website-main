
import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LeaderImageUploadProps {
  initial: string;
  profileImage?: string;
  onImageChange: (imageUrl: string | null) => void;
}

const LeaderImageUpload = ({ initial, profileImage, onImageChange }: LeaderImageUploadProps) => {
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(profileImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 2MB.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Create a preview URL for immediate feedback
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setTempImageUrl(dataUrl);
      };
      reader.readAsDataURL(file);
      
      // Generate a unique file name to prevent overwriting
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file);
        
      if (error) {
        throw error;
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath);
        
      // Pass the URL back to the parent component
      onImageChange(publicUrl);

      toast({
        title: "Image uploaded",
        description: "Profile image has been uploaded successfully.",
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveImage = () => {
    setTempImageUrl(null);
    onImageChange(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Avatar className="w-32 h-32 mb-4">
        {tempImageUrl ? (
          <AvatarImage src={tempImageUrl} alt="Profile preview" />
        ) : (
          <AvatarFallback className="bg-pfcu-purple text-white text-2xl">
            {initial || "?"}
          </AvatarFallback>
        )}
      </Avatar>
      
      <FormItem className="w-full">
        <FormLabel className="flex justify-center">
          <Button 
            type="button" 
            variant="secondary" 
            className="flex items-center gap-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Camera className="h-4 w-4" />
            <span>{isUploading ? 'Uploading...' : 'Choose Image'}</span>
          </Button>
        </FormLabel>
        <FormControl>
          <input 
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageUpload}
            accept="image/*"
          />
        </FormControl>
        <p className="text-xs text-center text-gray-500 mt-2">
          Select a profile picture (max 2MB)
        </p>
        <FormMessage />
      </FormItem>
      
      {tempImageUrl && (
        <Button 
          type="button" 
          variant="outline" 
          className="mt-2 text-xs h-8"
          onClick={handleRemoveImage}
          disabled={isUploading}
        >
          Remove Image
        </Button>
      )}
    </div>
  );
};

export default LeaderImageUpload;
