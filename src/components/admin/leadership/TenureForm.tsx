
import { useForm } from "react-hook-form";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useEffect } from "react";

interface TenureData {
  year: string;
  declaration: string;
}

interface TenureFormProps {
  initialData: TenureData;
  onSubmit: (data: TenureData) => void;
}

const TenureForm = ({ initialData, onSubmit }: TenureFormProps) => {
  const form = useForm<TenureData>({
    defaultValues: initialData
  });

  // Update form when initialData changes
  useEffect(() => {
    form.reset(initialData);
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tenure Year</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 2024/2025" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="declaration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tenure Declaration</FormLabel>
                <FormControl>
                  <Input placeholder="Fellowship declaration" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button 
          type="submit"
          className="bg-pfcu-purple hover:bg-pfcu-dark transition-colors duration-300"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Tenure Information
        </Button>
      </form>
    </Form>
  );
};

export default TenureForm;
