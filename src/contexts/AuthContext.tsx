
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerAdmin: (email: string, password: string, isFirstAdmin?: boolean) => Promise<boolean>;
  isSuperAdmin: boolean;
  checkSuperAdminStatus: () => Promise<boolean>;
  hasAdminUsers: () => Promise<boolean>;
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
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const hasAdminUsers = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('has_admin_users');
  
      if (error) {
        console.error("Error checking admin user count:", error);
        return false;
      }
  
      return data === true;
    } catch (err) {
      console.error("Unexpected error checking admin count:", err);
      return false;
    }
  };
  
  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          // Verify if the user is an admin
          const { data: isAdminData, error: isAdminError } = await supabase.rpc(
            'is_admin',
            { user_uid: data.session.user.id }
          );
          
          if (isAdminData === true && !isAdminError) {
            setIsAuthenticated(true);
            localStorage.setItem("pfcu_admin_auth", "true");
            
            // Check if user is super admin
            const { data: isSuperAdminData, error: isSuperAdminError } = await supabase.rpc(
              'is_super_admin',
              { user_uid: data.session.user.id }
            );
            
            if (isSuperAdminData === true && !isSuperAdminError) {
              setIsSuperAdmin(true);
            }
            
            console.log("Admin authentication confirmed");
          } else {
            console.log("User is not an admin:", isAdminError?.message);
            // If user is authenticated but not an admin, sign them out
            await supabase.auth.signOut();
            localStorage.removeItem("pfcu_admin_auth");
            setIsAuthenticated(false);
            setIsSuperAdmin(false);
          }
        } else {
          console.log("No active session found");
          localStorage.removeItem("pfcu_admin_auth");
          setIsAuthenticated(false);
          setIsSuperAdmin(false);
        }
      } catch (err) {
        console.error("Error checking session:", err);
        setIsAuthenticated(false);
        setIsSuperAdmin(false);
        localStorage.removeItem("pfcu_admin_auth");
      }
    };
    
    checkSession();
    
  }, []);

  const checkSuperAdminStatus = async (): Promise<boolean> => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        return false;
      }
      
      const { data, error } = await supabase.rpc(
        'is_super_admin',
        { user_uid: session.session.user.id }
      );
      
      if (error || data !== true) {
        return false;
      }
      
      setIsSuperAdmin(true);
      return true;
    } catch (error) {
      console.error("Error checking super admin status:", error);
      return false;
    }
  };

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
      const { data: isAdminData, error: isAdminError } = await supabase.rpc(
        'is_admin',
        { user_uid: data.user.id }
      );
      
      if (isAdminError || isAdminData !== true) {
        console.error("Admin verification failed:", isAdminError?.message || "User is not an admin");
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
      
      // Check if the user is a super admin
      const { data: isSuperAdminData, error: isSuperAdminError } = await supabase.rpc(
        'is_super_admin',
        { user_uid: data.user.id }
      );
      
      if (isSuperAdminData === true && !isSuperAdminError) {
        setIsSuperAdmin(true);
      }
      
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

  const registerAdmin = async (email: string, password: string, isFirstAdmin = false): Promise<boolean> => {
    try {
      // If not the first admin, check if the current user is authenticated as admin
      if (!isFirstAdmin) {
        const { data: session } = await supabase.auth.getSession();
        
        if (!session.session) {
          toast({
            title: "Unauthorized",
            description: "You must be logged in as an admin to create new admin accounts",
            variant: "destructive",
          });
          return false;
        }
        
        // Verify current user is admin
        const { data: isAdmin, error: isAdminError } = await supabase.rpc(
          'is_admin',
          { user_uid: session.session.user.id }
        );
        
        if (isAdminError || !isAdmin) {
          toast({
            title: "Unauthorized",
            description: "Only admin users can create new admin accounts",
            variant: "destructive",
          });
          return false;
        }
      }

      // Register the user in Supabase Auth with auto-confirm enabled for the first admin
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/login`,
          // For the first admin setup, let's not require email verification
          data: isFirstAdmin ? { is_first_admin: true } : undefined
        }
      });

      if (error) {
        console.error("Registration error:", error);
        throw error;
      }

      if (!data.user) {
        throw new Error("User creation failed");
      }
      
      console.log("Auth user created:", data.user.id);

      // Wait a moment for the auth user to be fully created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add the user to admin_users table (first admin is super admin)
      const { error: adminError } = await supabase
        .from('admin_users')
        .insert([{ 
          user_id: data.user.id,
          is_super_admin: isFirstAdmin 
        }]);

      if (adminError) {
        console.error("Admin user creation failed:", adminError);
        throw adminError;
      }

      toast({
        title: "Admin created successfully",
        description: isFirstAdmin ? 
          `${email} has been registered as an admin. Please check your email to confirm your account.` : 
          `${email} has been registered as an admin`,
      });

      // If this is the first admin setup, redirect to login
      if (isFirstAdmin) {
        navigate("/admin/login");
      }

      return true;
    } catch (error: any) {
      console.error("Admin registration failed:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create admin account",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setIsSuperAdmin(false);
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
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      registerAdmin, 
      isSuperAdmin,
      checkSuperAdminStatus, 
      hasAdminUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};
