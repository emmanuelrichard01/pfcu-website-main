import { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTop = () => {
  const [shouldShow, setShouldShow] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    // Update progress
    const scrolled = (winScroll / height) * 100;
    setProgress(scrolled);

    // Show if scrolled down enough
    if (winScroll > 300) {
      setShouldShow(true);

      // Clear existing timer
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Hide after 2.5 seconds of no scrolling (unless hovered)
      timeoutRef.current = setTimeout(() => {
        setShouldShow(false);
      }, 2500);
    } else {
      setShouldShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Keep visible if hovered and scrolled down, OR if actively scrolling (shouldShow true)
  // We check scrollY again to be safe for the hover case (don't show at top even if hovered)
  const isVisible = (shouldShow || isHovered) && (typeof window !== 'undefined' ? window.scrollY > 300 : false);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-24 md:bottom-8 right-6 z-40 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            // If we leave hover, restart the timer so it fades out if idle
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setShouldShow(false), 2500);
          }}
        >
          <button
            onClick={scrollToTop}
            className="relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-transform duration-300 hover:-translate-y-1 bg-white dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800"
            aria-label="Scroll to top"
          >
            {/* Progress Circle (re-added for context) */}
            <svg className="absolute w-full h-full -rotate-90 pointer-events-none p-0.5" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                strokeWidth="4"
                className="stroke-zinc-100 dark:stroke-zinc-800"
              />
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                strokeWidth="4"
                strokeDasharray="289"
                strokeDashoffset={289 - (progress / 100) * 289}
                className="stroke-pfcu-primary transition-all duration-100 ease-out"
                strokeLinecap="round"
              />
            </svg>

            <div className="relative z-10 text-pfcu-primary group-hover:scale-110 transition-transform duration-300">
              <ArrowUp size={20} className="stroke-[3px]" />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
