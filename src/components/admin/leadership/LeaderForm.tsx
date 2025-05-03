
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Save, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import LeaderImageUpload from "./LeaderImageUpload";

interface LeaderData {
  id?: string;
  name: string;
  position: string;
  initial: string;
  bio?: string;
  profileImage?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

interface LeaderFormProps {
  initialData: LeaderData;
  isSubmitting: boolean;
  onSubmit: (data: LeaderData) => Promise<void>;
  onCancel: () => void;
}

const LeaderForm = ({ initialData, isSubmitting, onSubmit, onCancel }: LeaderFormProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  
  const leaderForm = useForm<LeaderData>({
    defaultValues: initialData
  });

  // Update form when initialData changes
  useEffect(() => {
    leaderForm.reset(initialData);
  }, [initialData, leaderForm]);

  const handleFormSubmit = async (data: LeaderData) => {
    console.log("Form submitted with data:", data);
    await onSubmit(data);
  };
  
  // Define position options with the correct hierarchy
  const positionOptions = [
    { value: "Pastor/President", label: "Pastor/President" },
    { value: "Assistant Pastor/VP", label: "Assistant Pastor/VP" },
    { value: "General Secretary", label: "General Secretary" },
    { value: "Assistant Secretary & Treasurer", label: "Assistant Secretary & Treasurer" },
    { value: "P.R.O & Financial Secretary", label: "P.R.O & Financial Secretary" },
    { value: "Provost", label: "Provost" }
  ];

  const handleImageChange = (imageUrl: string | null) => {
    leaderForm.setValue("profileImage", imageUrl || "");
  };

  return (
    <Form {...leaderForm}>
      <form onSubmit={leaderForm.handleSubmit(handleFormSubmit)} className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="profile">Profile Picture</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="mt-0">
            <FormField
              control={leaderForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Leader's full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={leaderForm.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pfcu-purple"
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    >
                      {positionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={leaderForm.control}
              name="initial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initials</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. JD" {...field} maxLength={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={leaderForm.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Short biography or introduction" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="profile" className="mt-0">
            <FormField
              control={leaderForm.control}
              name="profileImage"
              render={({ field }) => (
                <FormItem>
                  <LeaderImageUpload
                    initial={leaderForm.getValues("initial")}
                    profileImage={field.value}
                    onImageChange={handleImageChange}
                  />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="social" className="mt-0">
            <FormField
              control={leaderForm.control}
              name="socialMedia.facebook"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel className="flex items-center gap-2">
                    Facebook URL
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://facebook.com/username" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={leaderForm.control}
              name="socialMedia.twitter"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel className="flex items-center gap-2">
                    X (formerly Twitter) URL
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://x.com/username" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={leaderForm.control}
              name="socialMedia.instagram"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel className="flex items-center gap-2">
                    Instagram URL
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://instagram.com/username" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={leaderForm.control}
              name="socialMedia.linkedin"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel className="flex items-center gap-2">
                    LinkedIn URL
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/username" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-pfcu-purple hover:bg-pfcu-dark transition-colors duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Leader
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default LeaderForm;
