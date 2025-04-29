
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Clock,
  Save
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

interface LeaderData {
  id?: string;
  name: string;
  position: string;
  initial: string;
}

interface TenureData {
  year: string;
  slogan: string;
}

const AdminLeadership = () => {
  const [leaders, setLeaders] = useState<LeaderData[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingLeader, setEditingLeader] = useState<LeaderData | null>(null);
  const [tenureData, setTenureData] = useState<TenureData>({
    year: "2024/2025",
    slogan: "Many but one in Christ"
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load data from localStorage for demo purposes
    // In a real app, this would be an API call
    const storedLeaders = localStorage.getItem("pfcu_leaders");
    const storedTenure = localStorage.getItem("pfcu_tenure");
    
    if (storedLeaders) {
      setLeaders(JSON.parse(storedLeaders));
    }
    
    if (storedTenure) {
      setTenureData(JSON.parse(storedTenure));
    }
  }, []);

  const leaderForm = useForm<LeaderData>({
    defaultValues: {
      name: "",
      position: "",
      initial: ""
    }
  });

  const tenureForm = useForm<TenureData>({
    defaultValues: tenureData
  });

  const handleOpenDialog = (leader?: LeaderData) => {
    if (leader) {
      setEditingLeader(leader);
      leaderForm.reset({
        name: leader.name,
        position: leader.position,
        initial: leader.initial
      });
    } else {
      setEditingLeader(null);
      leaderForm.reset({
        name: "",
        position: "",
        initial: ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleLeaderSubmit = (data: LeaderData) => {
    setIsSubmitting(true);
    
    // Update or create leader
    setTimeout(() => {
      let updatedLeaders;
      
      if (editingLeader) {
        // Update existing leader
        updatedLeaders = leaders.map(leader =>
          leader.name === editingLeader.name ? { ...data } : leader
        );
        toast({
          title: "Leader updated successfully",
          description: `${data.name}'s information has been updated.`
        });
      } else {
        // Add new leader
        updatedLeaders = [...leaders, { ...data, id: Date.now().toString() }];
        toast({
          title: "Leader added successfully",
          description: `${data.name} has been added to the leadership.`
        });
      }
      
      setLeaders(updatedLeaders);
      localStorage.setItem("pfcu_leaders", JSON.stringify(updatedLeaders));
      
      setIsSubmitting(false);
      setIsDialogOpen(false);
    }, 1000);
  };

  const handleDeleteLeader = (leaderToDelete: LeaderData) => {
    const updatedLeaders = leaders.filter(
      leader => leader.name !== leaderToDelete.name
    );
    setLeaders(updatedLeaders);
    localStorage.setItem("pfcu_leaders", JSON.stringify(updatedLeaders));
    
    toast({
      title: "Leader removed",
      description: `${leaderToDelete.name} has been removed from the leadership.`
    });
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
          className="bg-pfcu-purple hover:bg-pfcu-dark"
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
              className="bg-pfcu-purple hover:bg-pfcu-dark"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Tenure Information
            </Button>
          </form>
        </Form>
      </div>

      {/* Leaders Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Initial</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaders.map((leader) => (
              <TableRow key={leader.name}>
                <TableCell className="font-medium">{leader.name}</TableCell>
                <TableCell>{leader.position}</TableCell>
                <TableCell>{leader.initial}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleOpenDialog(leader)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteLeader(leader)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Leader Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
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
          
          <Form {...leaderForm}>
            <form onSubmit={leaderForm.handleSubmit(handleLeaderSubmit)} className="space-y-4">
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
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-pfcu-purple hover:bg-pfcu-dark"
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLeadership;
