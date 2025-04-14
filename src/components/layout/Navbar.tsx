
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState("");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) setMobileDropdownOpen("");
  };

  const toggleMobileDropdown = (name: string) => {
    setMobileDropdownOpen(mobileDropdownOpen === name ? "" : name);
  };
  
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

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container flex items-center justify-between py-4">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/542ae7a7-6ae0-4459-954e-0edf20905847.png" 
              alt="PFCU Logo" 
              className="h-12 w-12"
            />
            <span className="text-pfcu-purple font-display text-2xl font-bold">PFCU</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.div 
          className="hidden lg:flex items-center space-x-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {navLinks.map((link) => (
            link.children ? (
              <div key={link.name} className="relative group">
                <button className="flex items-center gap-1 text-gray-700 hover:text-pfcu-purple font-medium transition-colors">
                  {link.name}
                  <ChevronDown size={16} />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden transform scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-200 origin-top-left z-50">
                  {link.children.map((child) => (
                    <Link
                      key={child.name}
                      to={child.path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-pfcu-light hover:text-pfcu-purple transition-colors"
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
                className="text-gray-700 hover:text-pfcu-purple font-medium transition-colors"
              >
                {link.name}
              </Link>
            )
          ))}
        </motion.div>

        <motion.div 
          className="hidden lg:block"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Button className="bg-pfcu-purple hover:bg-pfcu-dark text-white">
            Join Fellowship
          </Button>
        </motion.div>

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 hover:text-pfcu-purple focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="lg:hidden bg-white border-t py-4 px-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                link.children ? (
                  <div key={link.name} className="border-b border-gray-100 pb-2">
                    <button
                      onClick={() => toggleMobileDropdown(link.name)}
                      className="w-full flex justify-between items-center text-gray-700 py-2"
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
                              className="text-gray-600 py-1 hover:text-pfcu-purple"
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
                    className="text-gray-700 hover:text-pfcu-purple border-b border-gray-100 py-2 block"
                    onClick={toggleMenu}
                  >
                    {link.name}
                  </Link>
                )
              ))}
              <Button className="bg-pfcu-purple hover:bg-pfcu-dark text-white w-full mt-4">
                Join Fellowship
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
