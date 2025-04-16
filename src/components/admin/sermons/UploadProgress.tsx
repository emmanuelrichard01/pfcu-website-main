
import { Progress } from "@/components/ui/progress";
import { FileAudio, FileImage } from "lucide-react";

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
  
  const isAudio = uploadingFile.match(/\.(mp3|wav|ogg)$/i);
  const isImage = uploadingFile.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  
  return (
    <div className="space-y-2 bg-gray-50 p-4 rounded-md border border-gray-200">
      <div className="flex justify-between text-sm items-center">
        <div className="flex items-center gap-2">
          {isAudio ? (
            <FileAudio className="h-4 w-4 text-blue-500" />
          ) : isImage ? (
            <FileImage className="h-4 w-4 text-green-500" />
          ) : null}
          <span>
            Uploading <span className="font-medium">{uploadingFile}</span>
          </span>
        </div>
        <span className="font-semibold">{uploadProgress}%</span>
      </div>
      
      <Progress 
        value={uploadProgress} 
        className="h-2" 
        indicatorClassName={isAudio ? "bg-blue-500" : isImage ? "bg-green-500" : ""}
      />
      
      <p className="text-xs text-gray-500">
        {uploadProgress < 100 ? 
          "Please wait while your file is uploading..." : 
          "Upload complete! Processing file..."}
      </p>
    </div>
  );
};

export default UploadProgress;
