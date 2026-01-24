import { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const calculateProgress = () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    setProgress(scrolled);
    setIsVisible(winScroll > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', calculateProgress);
    return () => window.removeEventListener('scroll', calculateProgress);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-24 md:bottom-8 right-6 z-40 group"
        >
          <button
            onClick={scrollToTop}
            className="relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-transform duration-300 hover:-translate-y-1"
            aria-label="Scroll to top"
          >
            {/* Progress Circle Background */}
            <div className="absolute inset-0 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800" />

            {/* Progress SVG */}
            <svg className="absolute w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                strokeWidth="4"
                className="stroke-zinc-200 dark:stroke-zinc-800"
              />
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                strokeWidth="4"
                strokeDasharray="301.59"
                strokeDashoffset={301.59 - (progress / 100) * 301.59}
                className="stroke-pfcu-primary transition-all duration-100 ease-out"
                strokeLinecap="round"
              />
            </svg>

            {/* Icon */}
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
