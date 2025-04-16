
import { useState, useEffect } from "react";
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
import { useSermons } from "@/hooks/useSermons";

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
  const { uploadFile } = useSermons();
  
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

  useEffect(() => {
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
  }, [sermon, editForm]);

  const onEditSubmit = async (data: SermonFormValues) => {
    if (!sermon) return;
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      let audioUrl = sermon.audio_url;
      let coverImageUrl = sermon.cover_image;
      
      if (data.sermonFile && data.sermonFile.length > 0) {
        const file = data.sermonFile[0];
        setUploadingFile(file.name);
        audioUrl = await uploadFile(file, 'sermons', 'audio', (progress) => {
          setUploadProgress(progress);
        });
      }
      
      setUploadProgress(0);
      
      if (data.coverImage && data.coverImage.length > 0) {
        const file = data.coverImage[0];
        setUploadingFile(file.name);
        coverImageUrl = await uploadFile(file, 'sermons', 'covers', (progress) => {
          setUploadProgress(progress);
        });
      }
      
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
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!isUploading) {
        onOpenChange(open);
      }
    }}>
      <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto">
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
                    <div className="flex flex-col gap-2">
                      <Input
                        type="file"
                        accept=".mp3,.wav,.pdf,.doc,.docx"
                        onChange={(e) => onChange(e.target.files)}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pfcu-purple file:text-white hover:file:bg-pfcu-dark"
                        {...fieldProps}
                      />
                      {sermon?.audio_url && (
                        <div className="text-xs text-gray-600 flex items-center">
                          <span className="mr-2">Current file:</span>
                          <a 
                            href={sermon.audio_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-pfcu-purple hover:underline"
                          >
                            View current file
                          </a>
                        </div>
                      )}
                    </div>
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
                    <div className="flex flex-col gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files)}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pfcu-purple file:text-white hover:file:bg-pfcu-dark"
                        {...fieldProps}
                      />
                      {sermon?.cover_image && (
                        <div className="flex items-start gap-2">
                          <img 
                            src={sermon.cover_image} 
                            alt="Current cover" 
                            className="w-16 h-16 object-cover rounded border"
                          />
                          <span className="text-xs text-gray-600">Current cover image</span>
                        </div>
                      )}
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
