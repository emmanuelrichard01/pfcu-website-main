import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const { login, hasAdminUsers } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    const checkAdmins = async () => {
      try {
        const exists = await hasAdminUsers();
        if (!ignore) setAdminExists(exists);
      } catch (error) {
        console.error("Error checking admin existence:", error);
        toast.error("Error checking admin status");
        setAdminExists(false);
      }
    };

    checkAdmins();
    return () => {
      ignore = true;
    };
  }, [hasAdminUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Welcome back!");
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
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-8 h-8 text-pfcu-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 relative overflow-hidden py-12 px-4">
      {/* Subtle Decorative Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pfcu-primary/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pfcu-secondary/5 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-white border-zinc-200 shadow-xl shadow-zinc-200/50">
          <CardHeader className="space-y-1 flex flex-col items-center pt-8 pb-4">
            <Link to="/" className="mb-6">
              <img
                src="/pfcu-logo.png"
                alt="PFCU Logo"
                className="h-16 w-auto object-contain"
              />
            </Link>
            <CardTitle className="text-2xl font-heading font-bold text-zinc-900 text-center">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-zinc-500 text-center">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            {!adminExists ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
                <Lock className="h-10 w-10 text-amber-500 mx-auto mb-3" />
                <p className="text-amber-700 mb-4">
                  No admin accounts found. Set up your first admin account.
                </p>
                <Link to="/admin/setup">
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-full">
                    Go to Admin Setup
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-zinc-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-pfcu-primary focus:ring-pfcu-primary/20 rounded-xl"
                      required
                      placeholder="admin@pfcu.edu"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-zinc-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-pfcu-primary focus:ring-pfcu-primary/20 rounded-xl"
                      required
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-pfcu-primary hover:bg-pfcu-primary/90 text-white rounded-full font-semibold text-base shadow-lg shadow-pfcu-primary/20 transition-all hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex justify-center pb-8 pt-2">
            <p className="text-xs text-zinc-400">
              {adminExists
                ? "Contact a super admin if you need account access"
                : "First time? Create an admin account to get started"}
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-zinc-500 mt-6">
          <Link to="/" className="hover:text-pfcu-primary transition-colors">
            ← Back to PFCU Home
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
