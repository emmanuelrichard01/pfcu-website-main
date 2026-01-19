
import { useState, useEffect } from "react";
import { Edit, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useSermons } from "@/hooks/useSermons";
import SermonForm, { SermonFormValues } from "./SermonForm";

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
  const { uploadFile, updateSermon } = useSermons();

  // Default form values
  const [defaultValues, setDefaultValues] = useState<SermonFormValues>({
    title: "",
    preacher: "",
    sermon_date: "",
    description: "",
    duration: "",
    sermonFile: null,
    coverImage: null
  });

  useEffect(() => {
    if (sermon) {
      setDefaultValues({
        title: sermon.title,
        preacher: sermon.preacher,
        sermon_date: sermon.sermon_date,
        description: sermon.description || "",
        duration: sermon.duration || "",
        sermonFile: null,
        coverImage: null
      });
    }
  }, [sermon]);

  const handleSubmit = async (data: SermonFormValues) => {
    if (!sermon) return;
    setIsUploading(true);

    try {
      const updateData: Partial<Sermon> = {
        title: data.title,
        preacher: data.preacher,
        sermon_date: data.sermon_date,
        description: data.description,
        duration: data.duration
        // Remove the updated_at property as it's not in the Sermon type
      };

      // Only update files if new ones are provided
      if (data.sermonFile && data.sermonFile.length > 0) {
        const file = data.sermonFile[0];
        setUploadingFile(file.name);
        setUploadProgress(0);

        const audioUrl = await uploadFile(file, 'sermons', 'audio', (progress) => {
          setUploadProgress(progress);
        });

        updateData.audio_url = audioUrl;
      }

      if (data.coverImage && data.coverImage.length > 0) {
        const file = data.coverImage[0];
        setUploadingFile(file.name);
        setUploadProgress(0);

        const coverImageUrl = await uploadFile(file, 'sermons', 'covers', (progress) => {
          setUploadProgress(progress);
        });

        updateData.cover_image = coverImageUrl;
      }

      const success = await updateSermon(sermon.id, updateData);

      if (success) {
        onOpenChange(false);
        onSermonUpdated();
      }
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

        <SermonForm
          key={sermon?.id || 'new'} // Force re-render when sermon changes
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          formId="edit-sermon-form"
          sermon={sermon}
        />

        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading {uploadingFile}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-pfcu-primary"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
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
            form="edit-sermon-form"
            className="bg-pfcu-primary text-white hover:bg-pfcu-primary/90"
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
      </DialogContent>
    </Dialog>
  );
};

export default EditSermonDialog;
