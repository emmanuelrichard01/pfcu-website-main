
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Upload, Clock } from "lucide-react";
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

interface SermonFormValues {
  title: string;
  preacher: string;
  sermon_date: string;
  description: string;
  duration: string;
  sermonFile: FileList | null;
  coverImage: FileList | null;
}

interface AddSermonDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSermonAdded: () => void;
}

const AddSermonDialog = ({ isOpen, onOpenChange, onSermonAdded }: AddSermonDialogProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFile, setUploadingFile] = useState("");
  const { toast } = useToast();
  
  const form = useForm<SermonFormValues>({
    defaultValues: {
      title: "",
      preacher: "",
      sermon_date: new Date().toISOString().split("T")[0],
      description: "",
      duration: "",
      sermonFile: null,
      coverImage: null
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

  const onSubmit = async (data: SermonFormValues) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Handle file uploads if files are selected
      let audioUrl = null;
      let coverImageUrl = null;
      
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
      
      // Save sermon data to the database
      const { error } = await supabase
        .from('sermons')
        .insert({
          title: data.title,
          preacher: data.preacher,
          sermon_date: data.sermon_date,
          description: data.description,
          duration: data.duration,
          audio_url: audioUrl,
          cover_image: coverImageUrl
        });
      
      if (error) throw error;
      
      toast({
        title: "Sermon uploaded successfully",
        description: "The sermon has been added to the library.",
      });
      
      onOpenChange(false);
      form.reset();
      onSermonAdded();
    } catch (error: any) {
      toast({
        title: "Error uploading sermon",
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
          <DialogTitle>Upload New Sermon</DialogTitle>
          <DialogDescription>
            Fill in the sermon details and upload audio or document files.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
              name="sermonFile"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Sermon File (Audio or PDF)</FormLabel>
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
              control={form.control}
              name="coverImage"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Cover Image (Optional)</FormLabel>
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
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Sermon
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

export default AddSermonDialog;
