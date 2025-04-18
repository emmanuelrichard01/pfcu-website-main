
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const { login, hasAdminUsers } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmins = async () => {
      try {
        const exists = await hasAdminUsers();
        setAdminExists(exists);
      } catch (error) {
        console.error("Error checking admin existence:", error);
        toast.error("Error checking admin status");
        setAdminExists(false);
      }
    };

    checkAdmins();
  }, [hasAdminUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      toast.info("Logging in...");
      const success = await login(email, password);
      if (success) {
        toast.success("Login successful!");
        navigate("/admin");
      }
    } catch (error) {
      console.error("Login submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (adminExists === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-10 h-10 border-4 border-pfcu-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-16 h-16 bg-pfcu-purple rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!adminExists ? (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
              <p className="text-amber-800 text-center mb-3">
                No admin accounts found. You need to set up an admin account first.
              </p>
              <Link to="/admin/setup">
                <Button className="w-full bg-amber-600 hover:bg-amber-700">
                  Go to Admin Setup
                </Button>
              </Link>
            </div>
          ) : (
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
                    placeholder="leadership@pfcu.edu"
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
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-pfcu-purple hover:bg-pfcu-dark mt-4"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            {adminExists ? "Contact an administrator if you need access" : "First time setup? Create an admin account to get started"}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
