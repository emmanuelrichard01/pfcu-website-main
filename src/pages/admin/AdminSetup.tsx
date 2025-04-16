
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminSetup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const { registerAdmin } = useAuth();
  const navigate = useNavigate();

  // Check if any admin accounts already exist
  useEffect(() => {
    const checkExistingAdmin = async () => {
      try {
        const { count, error } = await supabase
          .from('admin_users')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.error("Error checking admin users:", error);
          return;
        }
        
        if (count && count > 0) {
          setAdminExists(true);
          toast.error("Admin setup has already been completed");
          navigate("/admin/login");
        }
      } catch (error) {
        console.error("Admin check failed:", error);
      }
    };

    checkExistingAdmin();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return;
    }

    setIsLoading(true);
    
    try {
      toast.info("Setting up admin account...");
      
      const success = await registerAdmin(email, password, true);
      if (success) {
        toast.success("Admin account created successfully!");
        navigate("/admin/login");
      }
    } catch (error) {
      console.error("Setup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (adminExists) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Initial Admin Setup</CardTitle>
          <CardDescription className="text-center">
            Create the first administrator account for PFCU
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  placeholder="admin@pfcu.edu"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Minimum 6 characters"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit"
              className="w-full bg-pfcu-purple hover:bg-pfcu-dark mt-4" 
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Admin Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            This page is only accessible before the first admin is created
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminSetup;
