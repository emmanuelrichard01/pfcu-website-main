
import { useState } from "react";
import { Upload, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSermons } from "@/hooks/useSermons";
import SermonForm, { SermonFormValues } from "./SermonForm";
import UploadProgress from "./UploadProgress";

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
  
  const defaultValues: SermonFormValues = {
    title: "",
    preacher: "",
    sermon_date: new Date().toISOString().split("T")[0],
    description: "",
    duration: "",
    sermonFile: null,
    coverImage: null
  };

  const handleSubmit = async (data: SermonFormValues) => {
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
        
        <SermonForm 
          defaultValues={defaultValues} 
          onSubmit={handleSubmit} 
          formId="add-sermon-form"
        />
        
        <UploadProgress 
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          uploadingFile={uploadingFile}
        />
        
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
            form="add-sermon-form"
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
      </DialogContent>
    </Dialog>
  );
};

export default AddSermonDialog;
