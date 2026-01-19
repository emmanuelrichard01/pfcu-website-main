
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AdminUser } from "@/types/admin";

export function useAdminUsers() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserIsSuperAdmin, setCurrentUserIsSuperAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAdminUsers = async () => {
    setIsLoading(true);
    try {
      // Check if user is authenticated
      const { data: session } = await supabase.auth.getSession();

      if (!session?.session) {
        // No active session
        setIsLoading(false);
        return;
      }

      const userId = session.session.user.id;
      setCurrentUserId(userId);

      // Check super admin status
      const { data: isSuperAdmin, error: superAdminError } = await supabase.rpc(
        'is_super_admin',
        { user_uid: userId }
      );

      if (superAdminError) {
        console.error("Error checking super admin status:", superAdminError);
      } else {
        setCurrentUserIsSuperAdmin(!!isSuperAdmin);
      }

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
      const adminsWithEmails = await Promise.all(adminData.map(async (admin) => {
        try {
          // Use the RPC function to get the email securely
          const { data: emailData, error: emailError } = await supabase.rpc(
            'get_user_email',
            { user_uid: admin.user_id }
          );

          if (emailError) {
            console.error("Error fetching email:", emailError);
            throw emailError;
          }

          return {
            id: admin.id,
            user_id: admin.user_id,
            email: emailData as string || "Email not available",
            created_at: admin.created_at,
            is_super_admin: admin.is_super_admin || false
          };
        } catch (error) {
          console.error("Error fetching user email:", error);
          return {
            id: admin.id,
            user_id: admin.user_id,
            email: "Email not available",
            created_at: admin.created_at,
            is_super_admin: admin.is_super_admin || false
          };
        }
      }));

      setAdminUsers(adminsWithEmails as AdminUser[]);
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

  // Check if current user is super admin
  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const handleToggleSuperAdmin = async (adminId: string, userId: string, isSuperAdmin: boolean) => {
    if (!currentUserIsSuperAdmin) {
      toast({
        title: "Permission denied",
        description: "Only super admins can change admin roles",
        variant: "destructive"
      });
      return;
    }

    try {
      // Updating super admin status

      // Update the database record with new super admin status
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ is_super_admin: !isSuperAdmin })
        .eq('id', adminId);

      if (updateError) {
        console.error("Error updating admin role:", updateError);
        throw updateError;
      }

      // Update local state
      setAdminUsers(prevUsers =>
        prevUsers.map(admin =>
          admin.id === adminId
            ? { ...admin, is_super_admin: !isSuperAdmin }
            : admin
        )
      );

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

  const handleDeleteAdmin = async (adminId: string, userId: string, adminEmail: string) => {
    if (!currentUserIsSuperAdmin) {
      toast({
        title: "Permission denied",
        description: "Only super admins can delete admins",
        variant: "destructive"
      });
      return;
    }

    // Prevent super admin from deleting themselves
    if (userId === currentUserId) {
      toast({
        title: "Operation not allowed",
        description: "You cannot delete your own admin account",
        variant: "destructive"
      });
      return;
    }

    if (confirm(`Are you sure you want to delete admin ${adminEmail}?`)) {
      try {
        // Deleting admin record

        // Delete the database record
        const { error: deleteError } = await supabase
          .from('admin_users')
          .delete()
          .eq('id', adminId);

        if (deleteError) {
          console.error("Error deleting admin:", deleteError);
          throw deleteError;
        }

        // Update local state
        setAdminUsers(prevUsers => prevUsers.filter(admin => admin.id !== adminId));

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
    currentUserId,
    fetchAdminUsers,
    handleToggleSuperAdmin,
    handleDeleteAdmin
  };
}
