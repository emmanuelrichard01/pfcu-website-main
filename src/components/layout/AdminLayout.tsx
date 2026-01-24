
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
  ChevronLeft,
  Settings,
  Shield,
  LifeBuoy
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

const AdminLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<{ email: string; initials: string } | null>(null);

  // Clean, linear icons and structure
  const mainNav = [
    { name: "Overview", path: "/admin", icon: <LayoutDashboard size={18} /> },
    { name: "Sermons", path: "/admin/sermons", icon: <FileText size={18} /> },
    { name: "Events", path: "/admin/events", icon: <Calendar size={18} /> },
    { name: "Donations", path: "/admin/donations", icon: <DollarSign size={18} /> },
    { name: "People", path: "/admin/leadership", icon: <Users size={18} /> },
  ];

  const systemNav = [
    { name: "Users & Roles", path: "/admin/users", icon: <Shield size={18} /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings size={18} /> },
  ];

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
      if (isMobileView) setIsSidebarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const email = session.user.email || '';
        const initials = email.substring(0, 2).toUpperCase();
        setUserInfo({ email, initials });
      }
    };

    fetchCurrentUser();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleLogout = () => { logout(); navigate("/"); };

  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [location.pathname, isMobile]);

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 font-sans">

      {/* Mobile Toggle */}
      <div className={`lg:hidden fixed right-4 top-4 z-50`}>
        <Button
          variant="outline"
          size="icon"
          className="bg-white/80 dark:bg-black/50 backdrop-blur-md shadow-sm border-zinc-200 dark:border-zinc-800"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </Button>
      </div>

      {/* Sidebar - Linear Style */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || !isMobile) && (
          <motion.aside
            initial={isMobile ? { x: -300 } : { width: 0, opacity: 0 }}
            animate={isMobile ? { x: 0 } : { width: 280, opacity: 1 }}
            exit={isMobile ? { x: -300 } : { width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className={`
              fixed lg:sticky top-0 left-0 z-40 h-screen flex flex-col 
              bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800
              ${isMobile ? "shadow-2xl w-72" : "w-[280px]"}
            `}
          >
            {/* Header */}
            <div className="h-16 flex items-center px-6 border-b border-zinc-100 dark:border-zinc-800/50">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-white overflow-hidden shadow-sm flex items-center justify-center p-0.5">
                  <img src="/pfcu-logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-zinc-900 dark:text-white leading-none">PFCU CMS</h2>
                  <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Workspace</span>
                </div>
              </div>
            </div>

            {/* Nav */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">

              {/* Main Group */}
              <div className="space-y-1">
                <h3 className="px-3 text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Content</h3>
                {mainNav.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                      ${location.pathname === item.path
                        ? "bg-zinc-100 dark:bg-zinc-800 text-pfcu-primary dark:text-white shadow-sm ring-1 ring-zinc-200 dark:ring-white/10"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"
                      }
                    `}
                  >
                    <span className={location.pathname === item.path ? "opacity-100" : "opacity-70 group-hover:opacity-100"}>{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* System Group */}
              <div className="space-y-1">
                <h3 className="px-3 text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">System</h3>
                {systemNav.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                      ${location.pathname === item.path
                        ? "bg-zinc-100 dark:bg-zinc-800 text-pfcu-primary dark:text-white shadow-sm ring-1 ring-zinc-200 dark:ring-white/10"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"
                      }
                    `}
                  >
                    <span className={location.pathname === item.path ? "opacity-100" : "opacity-70 group-hover:opacity-100"}>{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>

            </div>

            {/* Footer */}
            <div className="p-3 border-t border-zinc-100 dark:border-zinc-800/50 space-y-1">
              <Link to="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-md transition-colors">
                <Home size={16} />
                <span>View Live Site</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600/80 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>

              {userInfo && (
                <div className="mt-4 flex items-center gap-3 px-2 py-2">
                  <Avatar className="h-8 w-8 ring-1 ring-zinc-200 dark:ring-zinc-700">
                    <AvatarFallback className="bg-zinc-100 text-zinc-700 text-xs font-bold">{userInfo.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">{userInfo.email}</p>
                    <p className="text-[10px] text-zinc-500">Administrator</p>
                  </div>
                </div>
              )}
            </div>

          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="max-w-6xl mx-auto p-6 lg:p-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminLayout;
