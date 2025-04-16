
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("pfcu_admin_auth") === "true"
  );
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          // Verify if the user is an admin
          const { data: adminData, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', data.session.user.id)
            .single();
          
          if (adminData && !error) {
            setIsAuthenticated(true);
            localStorage.setItem("pfcu_admin_auth", "true");
            console.log("Admin authentication confirmed");
          } else {
            console.log("User is not an admin:", error?.message);
            // If user is authenticated but not an admin, sign them out
            await supabase.auth.signOut();
            localStorage.removeItem("pfcu_admin_auth");
            setIsAuthenticated(false);
          }
        } else {
          console.log("No active session found");
          localStorage.removeItem("pfcu_admin_auth");
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Error checking session:", err);
        setIsAuthenticated(false);
        localStorage.removeItem("pfcu_admin_auth");
      }
    };
    
    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting login with:", email);
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Authentication error:", error);
        throw error;
      }
      
      console.log("User authenticated successfully:", data.user?.id);
      
      // Check if the authenticated user is in admin_users table
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', data.user.id)
        .single();
      
      if (adminError || !adminData) {
        console.error("Admin verification failed:", adminError?.message || "User is not an admin");
        toast({
          title: "Access denied",
          description: "You are not authorized to access the admin panel",
          variant: "destructive",
        });
        
        // Sign out if not an admin
        await supabase.auth.signOut();
        return false;
      }
      
      console.log("Admin access verified");
      // User is authenticated and is an admin
      setIsAuthenticated(true);
      localStorage.setItem("pfcu_admin_auth", "true");
      
      toast({
        title: "Login successful",
        description: "Welcome to PFCU Admin Panel",
      });
      
      return true;
    } catch (error: any) {
      console.error("Login process failed:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      localStorage.removeItem("pfcu_admin_auth");
      navigate("/");
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
