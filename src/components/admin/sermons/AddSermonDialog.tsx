
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
import { useSermons } from "@/hooks/useSermons";

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
  const { uploadFile } = useSermons();
  
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

  const onSubmit = async (data: SermonFormValues) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Handle file uploads if files are selected
      let audioUrl = null;
      let coverImageUrl = null;
      
      if (data.sermonFile && data.sermonFile.length > 0) {
        const file = data.sermonFile[0];
        setUploadingFile(file.name);
        audioUrl = await uploadFile(file, 'sermons', 'audio', (progress) => {
          setUploadProgress(progress);
        });
      }
      
      // Reset progress before uploading cover image
      setUploadProgress(0);
      
      if (data.coverImage && data.coverImage.length > 0) {
        const file = data.coverImage[0];
        setUploadingFile(file.name);
        coverImageUrl = await uploadFile(file, 'sermons', 'covers', (progress) => {
          setUploadProgress(progress);
        });
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
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!isUploading) {
        onOpenChange(open);
      }
    }}>
      <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto">
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
                    <div className="flex flex-col gap-2">
                      <Input
                        type="file"
                        accept=".mp3,.wav,.pdf,.doc,.docx"
                        onChange={(e) => onChange(e.target.files)}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pfcu-purple file:text-white hover:file:bg-pfcu-dark"
                        {...fieldProps}
                      />
                      <p className="text-xs text-gray-500">Accepted formats: MP3, WAV, PDF, DOC, DOCX</p>
                    </div>
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
                    <div className="flex flex-col gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files)}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pfcu-purple file:text-white hover:file:bg-pfcu-dark"
                        {...fieldProps}
                      />
                      <p className="text-xs text-gray-500">Recommended: 16:9 aspect ratio, JPG or PNG</p>
                    </div>
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
            
            <DialogFooter className="sticky bottom-0 bg-white pt-4 pb-2">
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
