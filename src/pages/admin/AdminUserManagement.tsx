
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { 
  Shield, 
  UserPlus, 
  Trash2,
  Clock,
  MailIcon
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
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

interface AdminFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const AdminUserManagement = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { registerAdmin } = useAuth();
  const { toast: toastUI } = useToast();

  const form = useForm<AdminFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  // Fetch admin users
  useEffect(() => {
    const fetchAdminUsers = async () => {
      setIsLoading(true);
      try {
        // Get all admin users
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*');

        if (adminError) {
          throw adminError;
        }

        if (!adminData) {
          setAdminUsers([]);
          return;
        }

        // Get user details for each admin
        const admins: AdminUser[] = [];
        
        for (const admin of adminData) {
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
            admin.user_id
          );
          
          if (!userError && userData) {
            admins.push({
              id: admin.id,
              email: userData.user.email || "Unknown",
              created_at: admin.created_at
            });
          }
        }

        setAdminUsers(admins);
      } catch (error) {
        console.error("Error fetching admin users:", error);
        toastUI({
          title: "Error",
          description: "Failed to load admin users",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminUsers();
  }, [toastUI]);

  const handleOpenDialog = () => {
    form.reset({
      email: "",
      password: "",
      confirmPassword: ""
    });
    setIsDialogOpen(true);
  };

  const handleCreateAdmin = async (data: AdminFormData) => {
    if (data.password !== data.confirmPassword) {
      form.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await registerAdmin(data.email, data.password);
      
      if (success) {
        setIsDialogOpen(false);
        form.reset();
        
        // Refresh admin users list
        // In a real application, we would implement proper refresh logic
        // For now, we'll just add a fake entry to the list
        setAdminUsers([
          ...adminUsers,
          {
            id: Math.random().toString(),
            email: data.email,
            created_at: new Date().toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error("Error creating admin:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string, adminEmail: string) => {
    // In a real application, we would implement proper delete functionality
    // For this demo, we'll just show a toast
    toast.info(`This would delete the admin user: ${adminEmail}`);
    
    toastUI({
      title: "Feature not implemented",
      description: "Admin deletion would require additional security checks",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Admin Users</h1>
          <p className="text-gray-600">Manage admin access to the PFCU panel</p>
        </div>
        
        <Button 
          className="bg-pfcu-purple hover:bg-pfcu-dark"
          onClick={handleOpenDialog}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
      </div>

      {/* Admin Users Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-pfcu-purple border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : adminUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  No admin users found
                </TableCell>
              </TableRow>
            ) : (
              adminUsers.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.email}</TableCell>
                  <TableCell>{new Date(admin.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Admin Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Admin User</DialogTitle>
            <DialogDescription>
              Create a new administrator account for the PFCU Admin Panel
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateAdmin)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input placeholder="Email address" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Minimum 6 characters" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm password" {...field} />
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Create Admin
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

export default AdminUserManagement;
