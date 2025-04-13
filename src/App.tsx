
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import RoleSelection from "./components/RoleSelection";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSermons from "./pages/admin/AdminSermons";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminLeadership from "./pages/admin/AdminLeadership";
import AdminLogin from "./pages/admin/AdminLogin";
import Giving from "./pages/Giving";
import AdminLayout from "./components/layout/AdminLayout";
import About from "./pages/About";
import History from "./pages/about/History";
import Leadership from "./pages/about/Leadership";
import Alumni from "./pages/about/Alumni";
import Units from "./pages/Units";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Contact from "./pages/Contact";
import Sermons from "./pages/Sermons";
import AdminDonations from "./pages/admin/AdminDonations";

const queryClient = new QueryClient();

const App = () => {
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  
  useEffect(() => {
    // Check if the user has already made a role selection
    const hasSelectedRole = localStorage.getItem("pfcu_role_selected");
    if (!hasSelectedRole) {
      setShowRoleSelection(true);
    }
  }, []);

  const handleRoleSelectionComplete = () => {
    setShowRoleSelection(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            {showRoleSelection && (
              <RoleSelection onComplete={handleRoleSelectionComplete} />
            )}
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/giving" element={<Giving />} />
              <Route path="/about" element={<About />} />
              <Route path="/history" element={<History />} />
              <Route path="/leadership" element={<Leadership />} />
              <Route path="/alumni" element={<Alumni />} />
              <Route path="/units" element={<Units />} />
              <Route path="/events" element={<Events />} />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/sermons" element={<Sermons />} />
              
              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="sermons" element={<AdminSermons />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="leadership" element={<AdminLeadership />} />
                <Route path="donations" element={<AdminDonations />} />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
