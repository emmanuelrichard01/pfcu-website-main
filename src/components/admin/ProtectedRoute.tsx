
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSetupNeeded, setAdminSetupNeeded] = useState(false);

  // Check if admin setup is needed and verify admin status
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        // First check if any admin users exist
        const { count, error: countError } = await supabase
          .from('admin_users')
          .select('*', { count: 'exact', head: true });
        
        if (countError) throw countError;
        
        // If no admins exist, redirect to setup
        if (count === 0) {
          console.log("No admin users found. Setup is needed.");
          setAdminSetupNeeded(true);
          setIsVerifying(false);
          return;
        }
        
        // If admins exist, verify current user is an admin
        const { data: session } = await supabase.auth.getSession();
        
        if (session.session) {
          const { data, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', session.session.user.id)
            .single();
          
          if (data && !error) {
            console.log("User verified as admin");
            setIsAdmin(true);
          } else {
            console.error("Admin verification failed:", error?.message);
          }
        }
      } catch (error) {
        console.error("Admin verification failed:", error);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAdmin();
  }, []);

  if (isVerifying) {
    // Show loading state while verifying
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-pfcu-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If admin setup is needed, redirect to setup page
  if (adminSetupNeeded) {
    console.log("Redirecting to admin setup");
    return <Navigate to="/admin/setup" replace />;
  }

  // Check both local state and admin verification
  if (!isAuthenticated || !isAdmin) {
    console.log("Access denied - Redirecting to login page");
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
