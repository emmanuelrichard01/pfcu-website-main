
import { useState, useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { getStorageString, STORAGE_KEYS } from "./lib/storage";

// Eagerly load critical pages for best initial load performance
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load admin pages (code splitting for better bundle size)
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminDonations = lazy(() => import("./pages/admin/AdminDonations"));
const AdminSermons = lazy(() => import("./pages/admin/AdminSermons"));
const AdminEvents = lazy(() => import("./pages/admin/AdminEvents"));
const AdminLeadership = lazy(() => import("./pages/admin/AdminLeadership"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminSetup = lazy(() => import("./pages/admin/AdminSetup"));
const AdminUserManagement = lazy(() => import("./pages/admin/AdminUserManagement"));
const Settings = lazy(() => import("./components/admin/settings/Settings"));
const AdminLayout = lazy(() => import("./components/layout/AdminLayout"));

// Lazy load secondary pages
const Giving = lazy(() => import("./pages/Giving"));
const About = lazy(() => import("./pages/About"));
const Departments = lazy(() => import("./pages/Departments"));
const Events = lazy(() => import("./pages/Events"));
const EventDetails = lazy(() => import("./pages/EventDetails"));
const Contact = lazy(() => import("./pages/Contact"));
const Sermons = lazy(() => import("./pages/Sermons"));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-pfcu-purple border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// QueryClient configured with sensible defaults for caching and refetching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Cache retained for 10 minutes (formerly cacheTime)
      retry: 2, // Retry failed requests twice
      refetchOnWindowFocus: false, // Don't refetch on tab focus
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/giving" element={<Giving />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/departments" element={<Departments />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/event/:id" element={<EventDetails />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/sermons" element={<Sermons />} />

                  {/* Admin Login and Setup */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/setup" element={<AdminSetup />} />

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
                    <Route path="users" element={<AdminUserManagement />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
