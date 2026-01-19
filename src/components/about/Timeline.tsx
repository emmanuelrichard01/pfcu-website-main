
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline = ({ events }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative pb-20">
      {/* Central Line Background */}
      <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[2px] bg-zinc-200 dark:bg-zinc-800 transform md:-translate-x-1/2 md:ml-[1px]" />

      {/* Animated Filling Line */}
      <motion.div
        style={{ height }}
        className="absolute left-[28px] md:left-1/2 top-0 w-[2px] bg-gradient-to-b from-pfcu-primary via-purple-500 to-pfcu-primary/50 transform md:-translate-x-1/2 md:ml-[1px] origin-top z-0"
      />

      <div className="space-y-24">
        {events.map((event, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={event.year}
              className={`relative flex items-start gap-8 md:gap-0 ${isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
            >
              {/* Timeline Node */}
              <div className="absolute left-[20px] md:left-1/2 top-0 transform md:-translate-x-1/2 flex items-center justify-center z-10 w-4 h-4">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.4 }}
                  className="w-4 h-4 rounded-full bg-white border-4 border-pfcu-primary shadow-[0_0_0_4px_rgba(255,255,255,1)] dark:shadow-[0_0_0_4px_rgba(9,9,11,1)]"
                />
              </div>

              {/* Empty Side (Desktop) */}
              <div className="hidden md:block md:w-1/2" />

              {/* Content Card */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`flex-1 pl-16 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}
              >
                <div className="relative group">
                  <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs tracking-wider border-pfcu-primary/20 text-pfcu-primary bg-pfcu-primary/5 group-hover:bg-pfcu-primary group-hover:text-white transition-colors duration-300">
                    {event.year}
                  </Badge>
                  <h3 className="text-2xl font-display font-bold text-zinc-900 dark:text-white mb-3 group-hover:text-pfcu-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
