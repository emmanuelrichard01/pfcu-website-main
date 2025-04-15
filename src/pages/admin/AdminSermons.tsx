
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { 
  FileText, 
  Upload, 
  Edit, 
  Trash2, 
  Search,
  Clock 
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

interface SermonFormValues {
  title: string;
  preacher: string;
  sermon_date: string;
  description: string;
  duration: string;
  sermonFile: FileList | null;
  coverImage: FileList | null;
}

const AdminSermons = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  const { toast } = useToast();
  
  const form = useForm<SermonFormValues>({
    defaultValues: {
      title: "",
      preacher: "",
      sermon_date: new Date().toISOString().split("T")[0],
      description: "",
      duration: "",
      sermonFile: null,
      coverImage: null
    }
  });
  
  const editForm = useForm<SermonFormValues>({
    defaultValues: {
      title: "",
      preacher: "",
      sermon_date: "",
      description: "",
      duration: "",
      sermonFile: null,
      coverImage: null
    }
  });

  const fetchSermons = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setSermons(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching sermons",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSermons();
  }, []);

  const onSubmit = async (data: SermonFormValues) => {
    setIsUploading(true);
    
    try {
      // Handle file uploads if files are selected
      let audioUrl = null;
      let coverImageUrl = null;
      
      if (data.sermonFile && data.sermonFile.length > 0) {
        const file = data.sermonFile[0];
        const { data: fileData, error: fileError } = await supabase.storage
          .from('sermons')
          .upload(`audio/${Date.now()}_${file.name}`, file);
        
        if (fileError) throw fileError;
        
        const { data: urlData } = supabase.storage
          .from('sermons')
          .getPublicUrl(fileData.path);
          
        audioUrl = urlData.publicUrl;
      }
      
      if (data.coverImage && data.coverImage.length > 0) {
        const file = data.coverImage[0];
        const { data: fileData, error: fileError } = await supabase.storage
          .from('sermons')
          .upload(`covers/${Date.now()}_${file.name}`, file);
        
        if (fileError) throw fileError;
        
        const { data: urlData } = supabase.storage
          .from('sermons')
          .getPublicUrl(fileData.path);
          
        coverImageUrl = urlData.publicUrl;
      }
      
      // Save sermon data to the database
      const { error } = await supabase
        .from('sermons')
        .insert({
          title: data.title,
          preacher: data.preacher,
          sermon_date: data.sermon_date,
          description: data.description,
          duration: data.duration,
          audio_url: audioUrl,
          cover_image: coverImageUrl
        });
      
      if (error) throw error;
      
      toast({
        title: "Sermon uploaded successfully",
        description: "The sermon has been added to the library.",
      });
      
      setIsAddDialogOpen(false);
      form.reset();
      fetchSermons();
    } catch (error: any) {
      toast({
        title: "Error uploading sermon",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleEdit = (sermon: Sermon) => {
    setSelectedSermon(sermon);
    editForm.reset({
      title: sermon.title,
      preacher: sermon.preacher,
      sermon_date: sermon.sermon_date,
      description: sermon.description || "",
      duration: sermon.duration || "",
      sermonFile: null,
      coverImage: null
    });
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (sermon: Sermon) => {
    setSelectedSermon(sermon);
    setIsDeleteDialogOpen(true);
  };
  
  const deleteSermon = async () => {
    if (!selectedSermon) return;
    
    try {
      const { error } = await supabase
        .from('sermons')
        .delete()
        .eq('id', selectedSermon.id);
      
      if (error) throw error;
      
      toast({
        title: "Sermon deleted successfully",
      });
      
      setIsDeleteDialogOpen(false);
      fetchSermons();
    } catch (error: any) {
      toast({
        title: "Error deleting sermon",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const onEditSubmit = async (data: SermonFormValues) => {
    if (!selectedSermon) return;
    setIsUploading(true);
    
    try {
      // Handle file uploads if files are selected
      let audioUrl = selectedSermon.audio_url;
      let coverImageUrl = selectedSermon.cover_image;
      
      if (data.sermonFile && data.sermonFile.length > 0) {
        const file = data.sermonFile[0];
        const { data: fileData, error: fileError } = await supabase.storage
          .from('sermons')
          .upload(`audio/${Date.now()}_${file.name}`, file, { upsert: true });
        
        if (fileError) throw fileError;
        
        const { data: urlData } = supabase.storage
          .from('sermons')
          .getPublicUrl(fileData.path);
          
        audioUrl = urlData.publicUrl;
      }
      
      if (data.coverImage && data.coverImage.length > 0) {
        const file = data.coverImage[0];
        const { data: fileData, error: fileError } = await supabase.storage
          .from('sermons')
          .upload(`covers/${Date.now()}_${file.name}`, file, { upsert: true });
        
        if (fileError) throw fileError;
        
        const { data: urlData } = supabase.storage
          .from('sermons')
          .getPublicUrl(fileData.path);
          
        coverImageUrl = urlData.publicUrl;
      }
      
      // Update sermon data in the database
      const { error } = await supabase
        .from('sermons')
        .update({
          title: data.title,
          preacher: data.preacher,
          sermon_date: data.sermon_date,
          description: data.description,
          duration: data.duration,
          audio_url: audioUrl,
          cover_image: coverImageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedSermon.id);
      
      if (error) throw error;
      
      toast({
        title: "Sermon updated successfully",
      });
      
      setIsEditDialogOpen(false);
      fetchSermons();
    } catch (error: any) {
      toast({
        title: "Error updating sermon",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const filteredSermons = sermons.filter(sermon =>
    sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sermon.preacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create storage bucket for sermons
  useEffect(() => {
    const createSermonsBucket = async () => {
      try {
        // Check if bucket already exists
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        if (bucketsError) throw bucketsError;
        
        const sermonsBucketExists = buckets.some(bucket => bucket.name === 'sermons');
        
        if (!sermonsBucketExists) {
          const { error } = await supabase.storage.createBucket('sermons', {
            public: true
          });
          
          if (error) throw error;
          
          console.log("Created sermons bucket");
        }
      } catch (error: any) {
        console.error("Error setting up storage:", error.message);
      }
    };
    
    createSermonsBucket();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Sermon Library</h1>
          <p className="text-gray-600">Manage your sermon uploads and resources</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              className="pl-9 w-full sm:w-64"
              placeholder="Search sermons..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            className="bg-pfcu-purple hover:bg-pfcu-dark"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Sermon
          </Button>
        </div>
      </div>

      {/* Sermons Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Preacher</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="w-8 h-8 border-4 border-pfcu-purple border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-500 mt-2">Loading sermons...</p>
                </TableCell>
              </TableRow>
            ) : filteredSermons.length > 0 ? (
              filteredSermons.map((sermon) => (
                <TableRow key={sermon.id}>
                  <TableCell className="font-medium flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-gray-400" />
                    {sermon.title}
                  </TableCell>
                  <TableCell>{sermon.preacher}</TableCell>
                  <TableCell>{new Date(sermon.sermon_date).toLocaleDateString()}</TableCell>
                  <TableCell>{sermon.duration || 'N/A'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(sermon)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(sermon)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  {searchQuery ? (
                    <p className="text-gray-500">No sermons match your search criteria</p>
                  ) : (
                    <p className="text-gray-500">No sermons have been added yet</p>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Sermon Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload New Sermon</DialogTitle>
            <DialogDescription>
              Fill in the sermon details and upload audio or document files.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <Input
                        type="file"
                        accept=".mp3,.pdf,.doc,.docx"
                        onChange={(e) => onChange(e.target.files)}
                        {...fieldProps}
                      />
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
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files)}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-pfcu-purple hover:bg-pfcu-dark"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Sermon
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Sermon Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Sermon</DialogTitle>
            <DialogDescription>
              Update the sermon details.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
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
                control={editForm.control}
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
                control={editForm.control}
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
                control={editForm.control}
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
                control={editForm.control}
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
                control={editForm.control}
                name="sermonFile"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Sermon File (Leave empty to keep current)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".mp3,.pdf,.doc,.docx"
                        onChange={(e) => onChange(e.target.files)}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="coverImage"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Cover Image (Leave empty to keep current)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files)}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-pfcu-purple hover:bg-pfcu-dark"
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
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this sermon? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteSermon}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSermons;
