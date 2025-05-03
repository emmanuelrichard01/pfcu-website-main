
import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "../ScrollToTop";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  
  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);
  
  useEffect(() => {
    // Enable smooth scrolling for internal links
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.href.startsWith(window.location.origin) && anchor.hash) {
        e.preventDefault();
        const targetId = anchor.hash.substring(1);
        const element = document.getElementById(targetId);
        
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth'
          });
          
          // Update URL without reloading the page
          history.pushState({}, '', anchor.href);
        }
      }
    };

    document.body.addEventListener('click', handleLinkClick);
    
    // Set html smooth scroll for the entire page
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.body.removeEventListener('click', handleLinkClick);
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default MainLayout;
