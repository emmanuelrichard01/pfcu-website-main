
import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  LayoutDashboard, 
  FileText, 
  Calendar,
  DollarSign,
  Users,
  LogOut,
  Menu,
  X,
  Shield
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

const AdminLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<{ email: string; initials: string } | null>(null);
  
  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Sermons", path: "/admin/sermons", icon: <FileText className="h-5 w-5" /> },
    { name: "Events", path: "/admin/events", icon: <Calendar className="h-5 w-5" /> },
    { name: "Donations", path: "/admin/donations", icon: <DollarSign className="h-5 w-5" /> },
    { name: "Leadership", path: "/admin/leadership", icon: <Users className="h-5 w-5" /> },
    { name: "Admin Users", path: "/admin/users", icon: <Shield className="h-5 w-5" /> },
    { name: "Main Site", path: "/", icon: <Home className="h-5 w-5" /> },
  ];

  // Fetch current user information
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const email = session.user.email || '';
        const nameParts = email.split('@')[0].split('.');
        let initials = '';
        
        if (nameParts.length >= 2) {
          // If email format is like firstname.lastname@example.com
          initials = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
        } else {
          // Just use first 2 letters of the email
          initials = email.substring(0, 2).toUpperCase();
        }
        
        setUserInfo({ email, initials });
      }
    };
    
    fetchCurrentUser();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile sidebar toggle - top-right */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="bg-white shadow-md hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar - fixed height with scrolling disabled */}
      <AnimatePresence>
        <motion.aside
          initial={{ x: -300, opacity: 0.5 }}
          animate={{ 
            x: isSidebarOpen ? 0 : -300,
            opacity: isSidebarOpen ? 1 : 0.5
          }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed lg:sticky top-0 left-0 z-40 w-64 h-screen bg-pfcu-dark text-white flex flex-col shadow-xl"
        >
          <div className="p-4 border-b border-pfcu-purple flex items-center space-x-3">
            <img
              src="/lovable-uploads/542ae7a7-6ae0-4459-954e-0edf20905847.png"
              alt="PFCU Logo"
              className="h-10 w-10 bg-white rounded-full p-1"
            />
            <h2 className="text-xl font-bold text-pfcu-gold">PFCU Admin</h2>
          </div>

          {/* Nav content with fixed layout - no scrolling */}
          <div className="flex flex-col h-full">
            <nav className="flex-1 py-6 px-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 ${
                        location.pathname === item.path
                          ? "bg-pfcu-purple text-white"
                          : "text-gray-300 hover:bg-pfcu-purple/20 hover:text-white hover:translate-x-1"
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Current user info */}
            {userInfo && (
              <div className="mx-4 mb-4 px-3 py-3 bg-pfcu-purple/20 rounded-md flex items-center group hover:bg-pfcu-purple/30 transition-colors">
                <Avatar className="h-8 w-8 mr-3 ring-2 ring-pfcu-gold/50 group-hover:ring-pfcu-gold transition-all">
                  <AvatarFallback className="bg-pfcu-gold text-pfcu-dark text-sm">
                    {userInfo.initials}
                  </AvatarFallback>
                </Avatar>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-sm text-white overflow-hidden">
                        <div className="font-semibold truncate max-w-[160px]">
                          {userInfo.email}
                        </div>
                        <div className="text-xs text-gray-300">
                          Currently Logged In
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{userInfo.email}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          
            {/* Logout button */}
            <div className="p-4 border-t border-pfcu-purple">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center space-x-2 text-white border-white hover:bg-red-600 hover:border-transparent transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 overflow-x-hidden transition-all duration-300" style={{ marginLeft: isSidebarOpen ? '0' : '-64px' }}>
        <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>

      {/* Overlay to close sidebar on mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 z-30 bg-black/50"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;
