
import { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Camera, Image as ImageIcon, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value?: string | null;
    onChange: (imageUrl: string | null) => void;
    bucketName?: string;
    folderPath?: string;
    label?: string;
    className?: string;
}

const ImageUpload = ({
    value,
    onChange,
    bucketName = "event_images",
    folderPath = "events",
    label = "Upload Image",
    className
}: ImageUploadProps) => {
    const [tempImageUrl, setTempImageUrl] = useState<string | null>(value || null);
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

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Image size should be less than 5MB.",
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

            // Generate a unique file name
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

            // Upload to Supabase storage
            // Note: This assumes the bucket exists. If not, this will fail.
            // We generally use 'public' or specific buckets like 'sermon_images' or 'profile_images'.
            // For events, we might try 'event_images' or fall back to a known one if specified.
            const { error } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file);

            if (error) {
                throw error;
            }

            // Get the public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            // Pass the URL back
            onChange(publicUrl);

            toast({
                title: "Image uploaded",
                description: "Image has been uploaded successfully.",
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
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemoveImage = () => {
        setTempImageUrl(null);
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="relative group w-full sm:w-48 h-32 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden border border-dashed border-gray-300 dark:border-zinc-700 flex items-center justify-center">
                        {tempImageUrl ? (
                            <>
                                <img
                                    src={tempImageUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="h-8 w-8 rounded-full"
                                        onClick={handleRemoveImage}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <ImageIcon className="h-8 w-8 mb-2" />
                                <span className="text-xs">No image</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                        <FormControl>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full sm:w-auto flex items-center gap-2"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            >
                                <Camera className="h-4 w-4" />
                                <span>{isUploading ? 'Uploading...' : 'Choose Image'}</span>
                            </Button>
                        </FormControl>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleImageUpload}
                            accept="image/*"
                        />
                        <p className="text-xs text-gray-500">
                            Recommended size: 1200x630px (Landscape). Max 5MB.
                        </p>
                    </div>
                </div>
                <FormMessage />
            </FormItem>
        </div>
    );
};

export default ImageUpload;
