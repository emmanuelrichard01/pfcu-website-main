
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Clock,
  Save,
  Camera,
  Facebook,
  Instagram,
  Linkedin,
  Twitter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLeadership } from "@/hooks/useLeadership";

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

interface TenureData {
  year: string;
  slogan: string;
}

const AdminLeadership = () => {
  const { leaders, loading, addLeader, updateLeader, deleteLeader } = useLeadership();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingLeader, setEditingLeader] = useState<LeaderData | null>(null);
  const [tenureData, setTenureData] = useState<TenureData>({
    year: "2024/2025",
    slogan: "Many but one in Christ"
  });
  const [activeTab, setActiveTab] = useState("basic");
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    // Load tenure data from localStorage
    const storedTenure = localStorage.getItem("pfcu_tenure");
    if (storedTenure) {
      setTenureData(JSON.parse(storedTenure));
    }
  }, []);

  const leaderForm = useForm<LeaderData>({
    defaultValues: {
      name: "",
      position: "",
      initial: "",
      bio: "",
      profileImage: "",
      socialMedia: {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: ""
      }
    }
  });

  const tenureForm = useForm<TenureData>({
    defaultValues: tenureData
  });

  const handleOpenDialog = (leader?: LeaderData) => {
    // Reset the form first to clear any previous data
    leaderForm.reset({
      name: "",
      position: "",
      initial: "",
      bio: "",
      profileImage: "",
      socialMedia: {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: ""
      }
    });
    
    setTempImageUrl(null);
    
    if (leader) {
      setEditingLeader(leader);
      setTempImageUrl(leader.profileImage || null);
      
      // Create a deep copy to avoid state reference issues
      const formValues = {
        name: leader.name,
        position: leader.position,
        initial: leader.initial,
        bio: leader.bio || "",
        profileImage: leader.profileImage || "",
        socialMedia: {
          facebook: leader.socialMedia?.facebook || "",
          twitter: leader.socialMedia?.twitter || "",
          instagram: leader.socialMedia?.instagram || "",
          linkedin: leader.socialMedia?.linkedin || ""
        }
      };
      
      leaderForm.reset(formValues);
    } else {
      setEditingLeader(null);
    }
    
    setIsDialogOpen(true);
    setActiveTab("basic");
  };

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
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setTempImageUrl(dataUrl);
      leaderForm.setValue("profileImage", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleLeaderSubmit = async (data: LeaderData) => {
    setIsSubmitting(true);
    
    try {
      let success = false;
      
      if (editingLeader?.id) {
        // Update existing leader
        success = await updateLeader(editingLeader.id, data);
      } else {
        // Add new leader
        success = await addLeader(data);
      }
      
      if (success) {
        setIsDialogOpen(false);
        setEditingLeader(null);
        setTempImageUrl(null);
      }
    } catch (error) {
      console.error("Leader save error:", error);
      toast({
        title: "Error",
        description: "There was an error saving the leader information.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLeader = async (leaderToDelete: LeaderData) => {
    if (leaderToDelete.id) {
      await deleteLeader(leaderToDelete.id);
    }
  };

  const handleTenureSubmit = (data: TenureData) => {
    setTenureData(data);
    localStorage.setItem("pfcu_tenure", JSON.stringify(data));
    
    toast({
      title: "Tenure information updated",
      description: "The tenure year and slogan have been updated."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Leadership Management</h1>
          <p className="text-gray-600">Manage fellowship leadership information</p>
        </div>
        
        <Button 
          className="bg-pfcu-purple hover:bg-pfcu-dark transition-colors duration-300"
          onClick={() => handleOpenDialog()}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Leader
        </Button>
      </div>

      {/* Tenure Information Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Tenure Information</h2>
        <Form {...tenureForm}>
          <form onSubmit={tenureForm.handleSubmit(handleTenureSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={tenureForm.control}
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
                control={tenureForm.control}
                name="slogan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenure Declaration</FormLabel>
                    <FormControl>
                      <Input placeholder="Fellowship slogan" {...field} />
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
      </div>

      {/* Leaders Table */}
      <div className="border rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="w-8 h-8 border-4 border-pfcu-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profile</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Social Media</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaders.map((leader) => (
                <TableRow key={leader.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      {leader.profileImage ? (
                        <AvatarImage src={leader.profileImage} alt={leader.name} />
                      ) : (
                        <AvatarFallback className="bg-pfcu-purple text-white">
                          {leader.initial}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{leader.name}</TableCell>
                  <TableCell>{leader.position}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {leader.socialMedia?.facebook && <Facebook className="h-4 w-4 text-gray-500" />}
                      {leader.socialMedia?.twitter && <Twitter className="h-4 w-4 text-gray-500" />}
                      {leader.socialMedia?.instagram && <Instagram className="h-4 w-4 text-gray-500" />}
                      {leader.socialMedia?.linkedin && <Linkedin className="h-4 w-4 text-gray-500" />}
                      {!leader.socialMedia?.facebook && 
                        !leader.socialMedia?.twitter && 
                        !leader.socialMedia?.instagram && 
                        !leader.socialMedia?.linkedin && 
                        <span className="text-xs text-gray-400">None</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => handleOpenDialog(leader)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                      onClick={() => handleDeleteLeader(leader)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add/Edit Leader Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingLeader ? "Edit Leader Information" : "Add New Leader"}
            </DialogTitle>
            <DialogDescription>
              {editingLeader 
                ? "Update the information for this leadership position"
                : "Add a new leader to the current tenure leadership"
              }
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="profile">Profile Picture</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
            </TabsList>
            
            <Form {...leaderForm}>
              <form onSubmit={leaderForm.handleSubmit(handleLeaderSubmit)} className="space-y-4">
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
                          <Input placeholder="Leadership position" {...field} />
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
                      render={({ field: { onChange, value, ...rest } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="flex justify-center">
                            <div className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors px-4 py-2 rounded-md">
                              <Camera className="h-4 w-4" />
                              <span>Choose Image</span>
                            </div>
                            <Input 
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              onChange={handleImageUpload}
                              accept="image/*"
                              {...rest}
                            />
                          </FormLabel>
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
                          leaderForm.setValue("profileImage", "");
                          
                          // Reset the file input
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
                          <Facebook className="h-4 w-4" /> Facebook URL
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://facebook.com/username" {...field} />
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
                          <Twitter className="h-4 w-4" /> Twitter URL
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://twitter.com/username" {...field} />
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
                          <Instagram className="h-4 w-4" /> Instagram URL
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://instagram.com/username" {...field} />
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
                          <Linkedin className="h-4 w-4" /> LinkedIn URL
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://linkedin.com/in/username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
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
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLeadership;
