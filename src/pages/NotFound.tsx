
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="min-h-[60vh] flex items-center justify-center bg-pfcu-light">
        <div className="text-center">
          <h1 className="text-8xl font-display font-bold text-pfcu-purple mb-4">404</h1>
          <p className="text-2xl text-gray-700 mb-8">Oops! Page not found</p>
          <Button asChild className="bg-pfcu-purple hover:bg-pfcu-dark text-white">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
