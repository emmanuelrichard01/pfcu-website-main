import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, ShieldAlert, Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const AdminSetup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const { registerAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingAdmin = async () => {
      try {
        const { data, error } = await supabase.rpc('has_admin_users');

        if (error) {
          console.error("Error checking admin users:", error);
          return;
        }

        if (data === true) {
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

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordLongEnough = password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    return null;
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
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-amber-200">
              <ShieldAlert className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-heading font-bold text-zinc-900 text-center">
              Initial Admin Setup
            </CardTitle>
            <CardDescription className="text-zinc-500 text-center">
              Create the first administrator account for PFCU
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
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
                    placeholder="Minimum 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password && (
                  <div className="flex items-center gap-2 text-xs mt-1">
                    {passwordLongEnough ? (
                      <><Check className="h-3 w-3 text-green-500" /><span className="text-green-600">6+ characters</span></>
                    ) : (
                      <><X className="h-3 w-3 text-red-500" /><span className="text-red-500">Needs 6+ characters</span></>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 pr-10 h-12 bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-pfcu-primary focus:ring-pfcu-primary/20 rounded-xl ${confirmPassword && !passwordsMatch ? "border-red-300" : ""
                      }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && (
                  <div className="flex items-center gap-2 text-xs mt-1">
                    {passwordsMatch ? (
                      <><Check className="h-3 w-3 text-green-500" /><span className="text-green-600">Passwords match</span></>
                    ) : (
                      <><X className="h-3 w-3 text-red-500" /><span className="text-red-500">Passwords do not match</span></>
                    )}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-pfcu-primary hover:bg-pfcu-primary/90 text-white rounded-full font-semibold text-base shadow-lg shadow-pfcu-primary/20 transition-all hover:scale-[1.02]"
                disabled={isLoading || !passwordsMatch || !passwordLongEnough}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Admin Account"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center pb-8 pt-2">
            <p className="text-xs text-zinc-400">
              This page is only accessible before the first admin is created
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-zinc-500 mt-6">
          <Link to="/admin/login" className="hover:text-pfcu-primary transition-colors">
            ← Back to Admin Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminSetup;
