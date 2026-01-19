import { motion } from "framer-motion";
import { LucideIcon, ArrowRight, User2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UnitProps {
  name: string;
  description: string;
  icon: LucideIcon;
  activities: string[];
  leaders: { name: string; position: string }[];
  onJoin?: () => void;
}

const UnitCard = ({ name, description, icon: Icon, activities, leaders, onJoin }: UnitProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      <div className="group relative h-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-pfcu-primary/5 transition-all duration-500">

        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-pfcu-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative p-8 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="p-3 rounded-2xl bg-pfcu-light dark:bg-pfcu-primary/10 text-pfcu-primary ring-1 ring-pfcu-primary/20 group-hover:scale-110 transition-transform duration-500">
              <Icon size={28} strokeWidth={1.5} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-2xl font-display font-bold text-zinc-900 dark:text-white mb-3 bg-clip-text group-hover:text-pfcu-primary transition-colors">
              {name}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 font-medium">
              {description}
            </p>

            {/* Activities Pills */}
            <div className="mb-8 flex flex-wrap gap-2">
              {activities.slice(0, 3).map((activity, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="bg-zinc-50 text-zinc-600 border-zinc-100 font-normal px-3 py-1 hover:bg-white hover:border-pfcu-primary/30 transition-colors"
                >
                  {activity}
                </Badge>
              ))}
              {activities.length > 3 && (
                <Badge variant="outline" className="text-zinc-400 border-dashed">+{activities.length - 3}</Badge>
              )}
            </div>
          </div>

          {/* Footer: Leaders & Action */}
          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-end justify-between gap-4">

            {/* Leadership Mini */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Leadership</span>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 overflow-hidden">
                  {leaders.map((_, i) => (
                    <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-zinc-900 bg-zinc-100 flex items-center justify-center">
                      <User2 size={14} className="text-zinc-400" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200">{leaders[0].name}</span>
                  <span className="text-[10px] text-zinc-500">{leaders[0].position}</span>
                </div>
              </div>
            </div>

            <Button
              size="icon"
              onClick={onJoin}
              className="rounded-full h-10 w-10 shrink-0 bg-zinc-900 hover:bg-pfcu-primary text-white transition-colors shadow-lg hover:shadow-pfcu-primary/30"
            >
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UnitCard;
