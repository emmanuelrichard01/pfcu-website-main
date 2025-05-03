
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Save, Clock, Camera } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

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
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const leaderForm = useForm<LeaderData>({
    defaultValues: initialData
  });

  // Update form when initialData changes
  useEffect(() => {
    leaderForm.reset(initialData);
    setTempImageUrl(initialData.profileImage || null);
  }, [initialData, leaderForm]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 2MB.",
        variant: "destructive"
      });
      return;
    }
    
    // Store the file for later use
    setImageFile(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setTempImageUrl(dataUrl);
      // Important: We're storing the data URL in the form
      leaderForm.setValue("profileImage", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (data: LeaderData) => {
    console.log("Form submitted with data:", data);
    
    // Forward the form data to the parent onSubmit handler
    await onSubmit(data);
  };
  
  // Define position options with the correct hierarchy
  const positionOptions = [
    { value: "Pastor/President", label: "Pastor/President" },
    { value: "Assistant Pastor/VP", label: "Assistant Pastor/VP" },
    { value: "General Secretary", label: "General Secretary" },
    { value: "Asst. Secretary & Treasurer", label: "Asst. Secretary & Treasurer" },
    { value: "P.R.O & Financial Secretary", label: "P.R.O & Financial Secretary" },
    { value: "Provost", label: "Provost" }
  ];

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
            <div className="flex flex-col items-center">
              <Avatar className="w-32 h-32 mb-4">
                {tempImageUrl ? (
                  <AvatarImage src={tempImageUrl} alt="Profile preview" />
                ) : (
                  <AvatarFallback className="bg-pfcu-purple text-white text-2xl">
                    {leaderForm.getValues("initial") || "?"}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <FormField
                control={leaderForm.control}
                name="profileImage"
                render={({ field: { value, onChange, ...rest } }) => (
                  <FormItem className="w-full">
                    <FormLabel className="flex justify-center">
                      <Button 
                        type="button" 
                        variant="secondary" 
                        className="flex items-center gap-2"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="h-4 w-4" />
                        <span>Choose Image</span>
                      </Button>
                    </FormLabel>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => {
                        handleImageUpload(e);
                      }}
                      accept="image/*"
                      {...rest}
                    />
                    <p className="text-xs text-center text-gray-500 mt-2">
                      Select a profile picture (max 2MB)
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {tempImageUrl && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="mt-2 text-xs h-8"
                  onClick={() => {
                    setTempImageUrl(null);
                    setImageFile(null);
                    leaderForm.setValue("profileImage", "");
                    
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Remove Image
                </Button>
              )}
            </div>
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
