
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

export interface SermonFormValues {
  title: string;
  preacher: string;
  sermon_date: string;
  description: string;
  duration: string;
  sermonFile: FileList | null;
  coverImage: FileList | null;
}

interface SermonFormProps {
  defaultValues: SermonFormValues;
  onSubmit: (data: SermonFormValues) => Promise<void>;
  formId?: string;
  sermon?: {
    id: string;
    audio_url: string | null;
    cover_image: string | null;
  } | null;
}

const SermonForm = ({ 
  defaultValues, 
  onSubmit, 
  formId = "sermon-form",
  sermon
}: SermonFormProps) => {
  const form = useForm<SermonFormValues>({
    defaultValues
  });

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <FormLabel>
                {sermon?.audio_url ? "Sermon File (Leave empty to keep current)" : "Sermon File (Audio or PDF)"}
              </FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    accept=".mp3,.wav,.pdf,.doc,.docx"
                    onChange={(e) => onChange(e.target.files)}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pfcu-purple file:text-white hover:file:bg-pfcu-dark"
                    {...fieldProps}
                  />
                  {sermon?.audio_url ? (
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
                  ) : (
                    <p className="text-xs text-gray-500">Accepted formats: MP3, WAV, PDF, DOC, DOCX</p>
                  )}
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
              <FormLabel>
                {sermon?.cover_image ? "Cover Image (Leave empty to keep current)" : "Cover Image (Optional)"}
              </FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files)}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pfcu-purple file:text-white hover:file:bg-pfcu-dark"
                    {...fieldProps}
                  />
                  {sermon?.cover_image ? (
                    <div className="flex items-start gap-2">
                      <img 
                        src={sermon.cover_image} 
                        alt="Current cover" 
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <span className="text-xs text-gray-600">Current cover image</span>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">Recommended: 16:9 aspect ratio, JPG or PNG</p>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default SermonForm;
