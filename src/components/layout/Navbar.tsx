
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { getStorageString, STORAGE_KEYS } from "@/lib/storage";
import JoinDialog from "./JoinDialog";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    if (isOpen) {
      document.body.style.overflow = '';
    } else {
      document.body.style.overflow = 'hidden';
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdmin = getStorageString(STORAGE_KEYS.ROLE_SELECTED) === "admin";

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Departments", path: "/departments" },
    { name: "Events", path: "/events" },
    { name: "Sermons", path: "/sermons" },
    { name: "Giving", path: "/giving" },
    { name: "Contact", path: "/contact" },
  ];

  if (isAdmin) {
    navLinks.push({ name: "Admin", path: "/admin" });
  }

  const isActiveLink = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none"
      >
        <div className={`
          pointer-events-auto
          relative rounded-full px-5 py-3 transition-all duration-300 ease-spring border
          ${scrolled
            ? 'w-full max-w-5xl bg-zinc-950/80 backdrop-blur-xl border-zinc-800/50 shadow-2xl shadow-black/20'
            : 'w-full max-w-7xl bg-white/5 backdrop-blur-md border-white/10 shadow-sm'
          }
        `}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 overflow-hidden rounded-full bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-inner">
                <img src="/pfcu-logo.png" alt="PFCU Logo" className="w-full h-full object-cover p-0.5" />
              </div>
              <span className={`font-heading font-bold text-xl tracking-tight transition-colors group-hover:text-pfcu-primary ${scrolled ? 'text-white' : 'text-white'}`}>
                PFCU
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative
                    ${isActiveLink(link.path)
                      ? 'text-white bg-white/10 shadow-sm border border-white/5'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                onClick={() => setJoinDialogOpen(true)}
                className="rounded-full bg-pfcu-primary hover:bg-pfcu-primary/90 text-white shadow-lg shadow-pfcu-primary/20 transition-all hover:scale-[1.02] active:scale-95 font-semibold px-6"
                size="sm"
              >
                Join Fellowship
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-zinc-300 hover:text-white transition-colors relative z-50"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-xl lg:hidden pt-32 px-6 pb-10 overflow-y-auto"
          >
            <motion.div
              className="flex flex-col gap-6 max-w-md mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={toggleMenu}
                  className={`text-2xl font-heading font-bold py-2 transition-colors border-b border-white/5 ${isActiveLink(link.path) ? 'text-pfcu-primary' : 'text-zinc-400 hover:text-white'}`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="mt-8">
                <Button
                  onClick={() => {
                    toggleMenu();
                    setJoinDialogOpen(true);
                  }}
                  className="w-full h-14 text-lg rounded-full bg-pfcu-primary text-white hover:bg-pfcu-primary/90"
                  size="lg"
                >
                  Join Fellowship
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <JoinDialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen} />
    </>
  );
};

export default Navbar;
