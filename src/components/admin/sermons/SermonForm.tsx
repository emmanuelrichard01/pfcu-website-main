
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
}

const SermonForm = ({ defaultValues, onSubmit, formId = "sermon-form" }: SermonFormProps) => {
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
      </form>
    </Form>
  );
};

export default SermonForm;
