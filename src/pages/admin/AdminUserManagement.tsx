
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Import new component files
import AdminUsersHeader from "@/components/admin/users/AdminUsersHeader";
import SuperAdminAlert from "@/components/admin/users/SuperAdminAlert";
import AdminUsersList from "@/components/admin/users/AdminUsersList";
import AddAdminDialog from "@/components/admin/users/AddAdminDialog";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { AdminFormData } from "@/types/admin";

const AdminUserManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registerAdmin } = useAuth();
  const { toast } = useToast();
  
  // Use the custom hook to manage admin users data and operations
  const {
    adminUsers,
    isLoading,
    currentUserIsSuperAdmin,
    handleToggleSuperAdmin,
    handleDeleteAdmin
  } = useAdminUsers();

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCreateAdmin = async (data: AdminFormData) => {
    setIsSubmitting(true);
    
    try {
      const success = await registerAdmin(data.email, data.password);
      
      if (success) {
        setIsDialogOpen(false);
        
        // Refresh the admin users list
        const { data: newAdminData, error: newAdminError } = await supabase
          .from('admin_users')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (!newAdminError && newAdminData) {
          toast({
            title: "Admin created",
            description: `${data.email} has been added as an admin`,
          });
          
          // The useEffect in useAdminUsers will refresh the list
        }
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      toast({
        title: "Error",
        description: "Failed to create admin user",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminUsersHeader onAddAdmin={handleOpenDialog} />
      
      <SuperAdminAlert isVisible={currentUserIsSuperAdmin} />

      <AdminUsersList
        isLoading={isLoading}
        adminUsers={adminUsers}
        currentUserIsSuperAdmin={currentUserIsSuperAdmin}
        onToggleSuperAdmin={handleToggleSuperAdmin}
        onDeleteAdmin={handleDeleteAdmin}
      />

      <AddAdminDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateAdmin}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AdminUserManagement;
