
import { useState } from "react";
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

interface SermonFormValues {
  title: string;
  preacher: string;
  date: string;
  description: string;
  sermonFile: FileList | null;
  coverImage: FileList | null;
}

const AdminSermons = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SermonFormValues>({
    defaultValues: {
      title: "",
      preacher: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
      sermonFile: null,
      coverImage: null
    }
  });

  // Sample data for demonstration
  const sermons = [
    { 
      id: "1", 
      title: "The Power of Faith", 
      preacher: "Pastor Johnson", 
      date: "2025-04-01", 
      downloads: 24 
    },
    { 
      id: "2", 
      title: "Walking in Love", 
      preacher: "Pastor Sarah", 
      date: "2025-03-25", 
      downloads: 18 
    },
    { 
      id: "3", 
      title: "Divine Purpose", 
      preacher: "Pastor Johnson", 
      date: "2025-03-18", 
      downloads: 32 
    },
    { 
      id: "4", 
      title: "Spiritual Growth", 
      preacher: "Pastor Emmanuel", 
      date: "2025-03-10", 
      downloads: 27 
    },
  ];

  const onSubmit = (data: SermonFormValues) => {
    setIsUploading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Sermon data submitted:", data);
      setIsUploading(false);
      setIsAddDialogOpen(false);
      form.reset();
      
      toast({
        title: "Sermon uploaded successfully",
        description: "The sermon has been added to the library.",
      });
    }, 1500);
  };

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
              <TableHead>Downloads</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sermons.map((sermon) => (
              <TableRow key={sermon.id}>
                <TableCell className="font-medium flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-gray-400" />
                  {sermon.title}
                </TableCell>
                <TableCell>{sermon.preacher}</TableCell>
                <TableCell>{new Date(sermon.date).toLocaleDateString()}</TableCell>
                <TableCell>{sermon.downloads}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Sermon Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
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
                name="date"
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
    </div>
  );
};

export default AdminSermons;
