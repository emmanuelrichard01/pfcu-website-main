
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Edit, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
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

interface SermonFormValues {
  title: string;
  preacher: string;
  sermon_date: string;
  description: string;
  duration: string;
  sermonFile: FileList | null;
  coverImage: FileList | null;
}

interface EditSermonDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sermon: Sermon | null;
  onSermonUpdated: () => void;
}

const EditSermonDialog = ({ 
  isOpen, 
  onOpenChange, 
  sermon, 
  onSermonUpdated 
}: EditSermonDialogProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFile, setUploadingFile] = useState("");
  const { toast } = useToast();
  
  const editForm = useForm<SermonFormValues>({
    defaultValues: {
      title: sermon?.title || "",
      preacher: sermon?.preacher || "",
      sermon_date: sermon?.sermon_date || "",
      description: sermon?.description || "",
      duration: sermon?.duration || "",
      sermonFile: null,
      coverImage: null
    }
  });

  // Update form values when sermon changes
  useState(() => {
    if (sermon) {
      editForm.reset({
        title: sermon.title,
        preacher: sermon.preacher,
        sermon_date: sermon.sermon_date,
        description: sermon.description || "",
        duration: sermon.duration || "",
        sermonFile: null,
        coverImage: null
      });
    }
  });

  // Function to upload a file with progress tracking
  const uploadFileWithProgress = async (file: File, bucket: string, folder: string) => {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const filePath = `${folder}/${Date.now()}_${file.name}`;
        setUploadingFile(file.name);
        setUploadProgress(0);
        
        // Create a FileReader to track progress
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const fileContent = e.target?.result;
            if (!fileContent) {
              throw new Error("Failed to read file");
            }
            
            // Use ArrayBuffer for upload
            const { data, error } = await supabase.storage
              .from(bucket)
              .upload(filePath, file, { upsert: true });
            
            if (error) throw error;
            
            // Get public URL
            const { data: urlData } = supabase.storage
              .from(bucket)
              .getPublicUrl(filePath);
              
            resolve(urlData.publicUrl);
          } catch (error) {
            reject(error);
          }
        };
        
        // Set up progress tracking
        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentage = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percentage);
          }
        };
        
        // Read the file as ArrayBuffer
        reader.readAsArrayBuffer(file);
      } catch (error) {
        reject(error);
      }
    });
  };

  const onEditSubmit = async (data: SermonFormValues) => {
    if (!sermon) return;
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Handle file uploads if files are selected
      let audioUrl = sermon.audio_url;
      let coverImageUrl = sermon.cover_image;
      
      if (data.sermonFile && data.sermonFile.length > 0) {
        const file = data.sermonFile[0];
        audioUrl = await uploadFileWithProgress(file, 'sermons', 'audio');
      }
      
      // Reset progress before uploading cover image
      setUploadProgress(0);
      
      if (data.coverImage && data.coverImage.length > 0) {
        const file = data.coverImage[0];
        coverImageUrl = await uploadFileWithProgress(file, 'sermons', 'covers');
      }
      
      // Update sermon data in the database
      const { error } = await supabase
        .from('sermons')
        .update({
          title: data.title,
          preacher: data.preacher,
          sermon_date: data.sermon_date,
          description: data.description,
          duration: data.duration,
          audio_url: audioUrl,
          cover_image: coverImageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', sermon.id);
      
      if (error) throw error;
      
      toast({
        title: "Sermon updated successfully",
      });
      
      onOpenChange(false);
      onSermonUpdated();
    } catch (error: any) {
      toast({
        title: "Error updating sermon",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadingFile("");
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Sermon</DialogTitle>
          <DialogDescription>
            Update the sermon details.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...editForm}>
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
            <FormField
              control={editForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sermon Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter sermon title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={editForm.control}
              name="preacher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preacher</FormLabel>
                  <FormControl>
                    <Input placeholder="Name of the preacher" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={editForm.control}
              name="sermon_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={editForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of the sermon" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={editForm.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 45 min" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={editForm.control}
              name="sermonFile"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Sermon File (Leave empty to keep current)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".mp3,.pdf,.doc,.docx"
                      onChange={(e) => onChange(e.target.files)}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={editForm.control}
              name="coverImage"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Cover Image (Leave empty to keep current)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files)}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading {uploadingFile}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-pfcu-purple hover:bg-pfcu-dark"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Update Sermon
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSermonDialog;
