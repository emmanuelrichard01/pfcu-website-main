
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AdminUser } from "@/types/admin";

export function useAdminUsers() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserIsSuperAdmin, setCurrentUserIsSuperAdmin] = useState(false);
  const { toast } = useToast();

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
            // Use the RPC function to get the email securely
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
        toast({
          title: "Error",
          description: "Failed to load admin users",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminUsers();
  }, [toast]);

  const handleToggleSuperAdmin = async (adminId: string, isSuperAdmin: boolean) => {
    if (!currentUserIsSuperAdmin) {
      toast({
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
      
      toast({
        title: "Admin role updated",
        description: `Admin is now ${!isSuperAdmin ? 'a super admin' : 'a regular admin'}`,
      });
    } catch (error: any) {
      console.error("Error updating admin role:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update admin role",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAdmin = async (adminId: string, adminEmail: string) => {
    if (!currentUserIsSuperAdmin) {
      toast({
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
        
        toast({
          title: "Admin deleted",
          description: `${adminEmail} has been removed from admin users`,
        });
      } catch (error: any) {
        console.error("Error deleting admin:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to delete admin",
          variant: "destructive"
        });
      }
    }
  };

  return {
    adminUsers,
    isLoading,
    currentUserIsSuperAdmin,
    handleToggleSuperAdmin,
    handleDeleteAdmin
  };
}
