
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

  // Double-check admin status for extra security
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (session.session) {
          const { data } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', session.session.user.id)
            .single();
          
          if (data) {
            setIsAdmin(true);
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

  // Check both local state and admin verification
  if (!isAuthenticated || !isAdmin) {
    console.log("Access denied - Redirecting to login page");
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
