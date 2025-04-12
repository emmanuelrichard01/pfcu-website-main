
import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  DollarSign, 
  LogOut,
  Menu,
  X
} from "lucide-react";

const AdminLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Sermons", path: "/admin/sermons", icon: <FileText className="h-5 w-5" /> },
    { name: "Events", path: "/admin/events", icon: <Calendar className="h-5 w-5" /> },
    { name: "Giving", path: "/admin/giving", icon: <DollarSign className="h-5 w-5" /> },
    { name: "Main Site", path: "/", icon: <Home className="h-5 w-5" /> },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="bg-white"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out bg-pfcu-dark text-white flex flex-col`}
      >
        <div className="p-4 border-b border-pfcu-purple flex items-center space-x-3">
          <img
            src="/lovable-uploads/542ae7a7-6ae0-4459-954e-0edf20905847.png"
            alt="PFCU Logo"
            className="h-10 w-10 bg-white rounded-full p-1"
          />
          <h2 className="text-xl font-bold text-pfcu-gold">PFCU Admin</h2>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? "bg-pfcu-purple text-white"
                      : "text-gray-300 hover:bg-pfcu-purple/20 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-pfcu-purple">
          <Button variant="outline" className="w-full flex items-center space-x-2 text-white border-white hover:bg-pfcu-purple">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-x-hidden">
        <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>

      {/* Overlay to close sidebar on mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50 transition-opacity"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AdminLayout;
