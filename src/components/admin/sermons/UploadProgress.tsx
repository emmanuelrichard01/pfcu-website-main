
import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  isUploading: boolean;
  uploadProgress: number;
  uploadingFile: string;
}

const UploadProgress = ({ 
  isUploading, 
  uploadProgress, 
  uploadingFile 
}: UploadProgressProps) => {
  if (!isUploading) return null;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Uploading {uploadingFile}</span>
        <span>{uploadProgress}%</span>
      </div>
      <Progress value={uploadProgress} className="h-2" />
    </div>
  );
};

export default UploadProgress;
