
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { 
  Shield, 
  UserPlus, 
  Trash2,
  Clock,
  MailIcon,
  Award
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
import { Badge } from "@/components/ui/badge";
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
  is_super_admin: boolean;
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
  const [currentUserIsSuperAdmin, setCurrentUserIsSuperAdmin] = useState(false);
  const { registerAdmin } = useAuth();
  const { toast: toastUI } = useToast();

  const form = useForm<AdminFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  // Check if current user is super admin
  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (session.session) {
          const { data, error } = await supabase.rpc(
            'is_super_admin',
            { user_uid: session.session.user.id }
          );
          
          if (!error && data === true) {
            setCurrentUserIsSuperAdmin(true);
          }
        }
      } catch (error) {
        console.error("Error checking super admin status:", error);
      }
    };
    
    checkSuperAdmin();
  }, []);

  // Fetch admin users
  useEffect(() => {
    const fetchAdminUsers = async () => {
      setIsLoading(true);
      try {
        // Get all admin users with their super admin status
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*');

        if (adminError) throw adminError;

        if (!adminData || adminData.length === 0) {
          setAdminUsers([]);
          setIsLoading(false);
          return;
        }

        // For each admin user, get their email using the RPC function
        const adminWithEmails = await Promise.all(adminData.map(async (admin) => {
          try {
            // Use the RPC function to get the email securely - ensure we cast the result properly
            const { data: emailData, error: emailError } = await supabase.rpc<string>(
              'get_user_email',
              { user_uid: admin.user_id }
            );
            
            if (emailError) {
              console.error("Error fetching email:", emailError);
              throw emailError;
            }
            
            return {
              id: admin.id,
              email: emailData || "Email not available",
              created_at: admin.created_at,
              is_super_admin: admin.is_super_admin || false
            };
          } catch (error) {
            console.error("Error fetching user email:", error);
            return {
              id: admin.id,
              email: "Email not available",
              created_at: admin.created_at,
              is_super_admin: admin.is_super_admin || false
            };
          }
        }));

        setAdminUsers(adminWithEmails);
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
        
        // Refresh the admin users list
        const { data: newAdminData, error: newAdminError } = await supabase
          .from('admin_users')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (!newAdminError && newAdminData) {
          setAdminUsers([
            {
              id: newAdminData.id,
              email: data.email,
              created_at: newAdminData.created_at,
              is_super_admin: newAdminData.is_super_admin || false
            },
            ...adminUsers
          ]);
        }
      }
    } catch (error) {
      console.error("Error creating admin:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleSuperAdmin = async (adminId: string, isSuperAdmin: boolean) => {
    if (!currentUserIsSuperAdmin) {
      toastUI({
        title: "Permission denied",
        description: "Only super admins can change admin roles",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ is_super_admin: !isSuperAdmin })
        .eq('id', adminId);
        
      if (error) throw error;
      
      // Update local state
      setAdminUsers(adminUsers.map(admin => 
        admin.id === adminId 
          ? { ...admin, is_super_admin: !isSuperAdmin } 
          : admin
      ));
      
      toastUI({
        title: "Admin role updated",
        description: `Admin is now ${!isSuperAdmin ? 'a super admin' : 'a regular admin'}`,
      });
    } catch (error: any) {
      console.error("Error updating admin role:", error);
      toastUI({
        title: "Error",
        description: error.message || "Failed to update admin role",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAdmin = async (adminId: string, adminEmail: string) => {
    if (!currentUserIsSuperAdmin) {
      toastUI({
        title: "Permission denied",
        description: "Only super admins can delete admins",
        variant: "destructive"
      });
      return;
    }
    
    if (confirm(`Are you sure you want to delete admin ${adminEmail}?`)) {
      try {
        const { error } = await supabase
          .from('admin_users')
          .delete()
          .eq('id', adminId);
          
        if (error) throw error;
        
        // Update local state
        setAdminUsers(adminUsers.filter(admin => admin.id !== adminId));
        
        toastUI({
          title: "Admin deleted",
          description: `${adminEmail} has been removed from admin users`,
        });
      } catch (error: any) {
        console.error("Error deleting admin:", error);
        toastUI({
          title: "Error",
          description: error.message || "Failed to delete admin",
          variant: "destructive"
        });
      }
    }
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

      {currentUserIsSuperAdmin && (
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <div className="flex items-center gap-2">
            <Award className="text-amber-600 h-5 w-5" />
            <p className="text-amber-800">
              You are a Super Admin. You can manage all other admins.
            </p>
          </div>
        </div>
      )}

      {/* Admin Users Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-pfcu-purple border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : adminUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  No admin users found
                </TableCell>
              </TableRow>
            ) : (
              adminUsers.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.email}</TableCell>
                  <TableCell>
                    {admin.is_super_admin ? (
                      <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">Super Admin</Badge>
                    ) : (
                      <Badge variant="outline">Admin</Badge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(admin.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {currentUserIsSuperAdmin && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleSuperAdmin(admin.id, admin.is_super_admin)}
                          className={admin.is_super_admin ? "text-amber-500" : "text-gray-500"}
                          title={admin.is_super_admin ? "Demote to Admin" : "Promote to Super Admin"}
                        >
                          <Award className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
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
