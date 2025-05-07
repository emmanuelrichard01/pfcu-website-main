
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

// Import components
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
    currentUserId,
    fetchAdminUsers,
    handleToggleSuperAdmin,
    handleDeleteAdmin
  } = useAdminUsers();

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCreateAdmin = async (data: AdminFormData) => {
    setIsSubmitting(true);
    
    try {
      if (!data.email || !data.password) {
        throw new Error("Email and password are required");
      }
      
      const success = await registerAdmin(data.email, data.password);
      
      if (success) {
        setIsDialogOpen(false);
        toast({
          title: "Admin created successfully",
          description: `${data.email} has been added as an admin user`,
        });
        
        // Refresh the admin users list
        fetchAdminUsers();
      } else {
        throw new Error("Failed to create admin user");
      }
    } catch (error: any) {
      console.error("Error creating admin:", error);
      
      let errorMessage = "Failed to create admin user.";
      if (error.message?.includes("already exists")) {
        errorMessage = "User already exists. Try a different email address.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AdminUsersHeader onAddAdmin={handleOpenDialog} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <SuperAdminAlert isVisible={currentUserIsSuperAdmin} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <AdminUsersList
          isLoading={isLoading}
          adminUsers={adminUsers}
          currentUserIsSuperAdmin={currentUserIsSuperAdmin}
          currentUserId={currentUserId}
          onToggleSuperAdmin={handleToggleSuperAdmin}
          onDeleteAdmin={handleDeleteAdmin}
        />
      </motion.div>

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
