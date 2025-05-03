
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) setMobileDropdownOpen("");
  };

  const toggleMobileDropdown = (name: string) => {
    setMobileDropdownOpen(mobileDropdownOpen === name ? "" : name);
  };

  // Handle scroll events to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Check if user is admin based on local storage
  const isAdmin = localStorage.getItem("pfcu_role_selected") === "admin";

  const navLinks = [
    { name: "Home", path: "/" },
    { 
      name: "About", 
      children: [
        { name: "Our History", path: "/history" },
        { name: "Leadership", path: "/leadership" },
        { name: "Alumni", path: "/alumni" }
      ]
    },
    { name: "Units", path: "/units" },
    { name: "Events", path: "/events" },
    { name: "Sermons", path: "/sermons" },
    { name: "Giving", path: "/giving" },
    { name: "Contact", path: "/contact" },
  ];
  
  // Add Admin link only if user is admin
  if (isAdmin) {
    navLinks.push({ name: "Admin", path: "/admin" });
  }

  const isActiveLink = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-md py-2' 
        : 'bg-white py-4'
      }`}
    >
      <div className="container flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/" className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-pfcu-purple p-2 flex items-center justify-center overflow-hidden transition-transform hover:scale-105">
              <img 
                src="/lovable-uploads/542ae7a7-6ae0-4459-954e-0edf20905847.png" 
                alt="PFCU Logo" 
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-pfcu-purple font-display text-2xl md:text-3xl font-bold">PFCU</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.div 
          className="hidden lg:flex items-center space-x-2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1, delay: 0.3 }}
        >
          {navLinks.map((link, index) => (
            link.children ? (
              <div key={link.name} className="relative group">
                <button className={`flex items-center gap-1 px-3 py-2 rounded-md text-gray-700 font-medium transition-colors ${
                  isActiveLink(link.children[0].path) ? 'text-pfcu-purple' : 'hover:text-pfcu-purple'
                }`}>
                  {link.name}
                  <ChevronDown size={16} className="transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute left-0 mt-1 w-48 bg-white shadow-xl rounded-lg overflow-hidden transform scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-200 origin-top-left z-50">
                  {link.children.map((child) => (
                    <Link
                      key={child.name}
                      to={child.path}
                      className={`block px-4 py-3 text-sm hover:bg-pfcu-light hover:text-pfcu-purple transition-colors ${
                        isActiveLink(child.path) ? 'bg-pfcu-light text-pfcu-purple font-medium' : 'text-gray-700'
                      }`}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-md font-medium transition-all relative ${
                  isActiveLink(link.path) 
                    ? 'text-pfcu-purple' 
                    : 'text-gray-700 hover:text-pfcu-purple'
                }`}
              >
                {link.name}
                {isActiveLink(link.path) && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-pfcu-gold"
                    layoutId="navIndicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            )
          ))}
        </motion.div>

        <motion.div 
          className="hidden lg:block"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button className="bg-pfcu-purple hover:bg-pfcu-dark text-white px-6 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg">
            Join Fellowship
          </Button>
        </motion.div>

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 hover:text-pfcu-purple focus:outline-none p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="lg:hidden bg-white border-t py-4 px-4 shadow-xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                link.children ? (
                  <div key={link.name} className="border-b border-gray-100 pb-2">
                    <button
                      onClick={() => toggleMobileDropdown(link.name)}
                      className="w-full flex justify-between items-center text-gray-700 py-3 font-medium"
                    >
                      <span>{link.name}</span>
                      <ChevronDown size={16} className={`transition-transform duration-200 ${mobileDropdownOpen === link.name ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {mobileDropdownOpen === link.name && (
                        <motion.div 
                          className="pl-4 pt-2 flex flex-col space-y-2"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.path}
                              className={`py-2 px-3 rounded-md ${
                                isActiveLink(child.path) 
                                  ? 'bg-pfcu-light text-pfcu-purple' 
                                  : 'text-gray-600 hover:text-pfcu-purple'
                              }`}
                              onClick={toggleMenu}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`py-3 px-3 block rounded-md ${
                      isActiveLink(link.path) 
                        ? 'bg-pfcu-light text-pfcu-purple font-medium' 
                        : 'text-gray-700 hover:text-pfcu-purple'
                    } border-b border-gray-100`}
                    onClick={toggleMenu}
                  >
                    {link.name}
                  </Link>
                )
              ))}
              <div className="pt-4">
                <Button className="bg-pfcu-purple hover:bg-pfcu-dark text-white w-full">
                  Join Fellowship
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
