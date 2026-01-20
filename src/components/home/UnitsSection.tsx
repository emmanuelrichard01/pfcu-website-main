import { Card, CardContent } from "@/components/ui/card";
import {
  Church,
  BookOpen,
  Users,
  Music,
  Palette,
  Shield,
  Baby,
  Video,
  HandHeart,
  ArrowRight,
  Megaphone,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface UnitCardProps {
  name: string;
  description: string;
  icon: React.ElementType;
}

const UnitCard = ({ name, description, icon: Icon }: UnitCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="h-full bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-pfcu-primary/20 transition-all duration-300 rounded-3xl overflow-hidden group relative">
        {/* Subtle top accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pfcu-primary to-pfcu-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

        <CardContent className="p-8 h-full flex flex-col items-start relative z-10">
          {/* Icon Container */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-pfcu-primary/10 rounded-2xl transform rotate-3 transition-transform group-hover:rotate-6"></div>
            <div className="relative w-14 h-14 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl flex items-center justify-center text-pfcu-primary shadow-sm group-hover:text-pfcu-secondary transition-colors">
              <Icon size={26} strokeWidth={1.5} />
            </div>
          </div>

          <h3 className="font-heading text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100 leading-tight group-hover:text-pfcu-primary transition-colors">
            {name}
          </h3>

          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed flex-grow mb-6">
            {description}
          </p>

          <div className="w-full pt-4 mt-auto border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-pfcu-primary group/link cursor-pointer">
              <span>View Details</span>
              <ArrowRight size={14} className="ml-2 transform transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const UnitsSection = () => {
  const units = [
    {
      name: "Christian Education",
      description: "Dedicated to spiritual growth through systematic biblical teaching and academic excellence.",
      icon: BookOpen
    },
    {
      name: "Chaplaincy",
      description: "Ensures smooth services through orderliness, protocol, and sanctuary maintenance.",
      icon: Church
    },
    {
      name: "Beautification",
      description: "Creating an atmosphere conducive for worship through aesthetic excellence and design.",
      icon: Palette
    },
    {
      name: "Media & Communications",
      description: "The voice and image of the fellowship, managing internal and external communications.",
      icon: Megaphone
    },
    {
      name: "Creative Arts",
      description: "Expressing the gospel through drama, dance, spoken word, and creative ministrations.",
      icon: Sparkles
    },
    {
      name: "Intercessory",
      description: "The spiritual powerhouse standing in the gap through fervent prayer and intercession.",
      icon: Shield
    },
    {
      name: "Outreach & Care",
      description: "Extending Christ's love to the community and caring for members' welfare.",
      icon: HandHeart
    },
    {
      name: "PFCU Little Angel’s",
      description: "Nurturing the next generation of children in the way of the Lord.",
      icon: Baby
    },
    {
      name: "Worship",
      description: "Leading the fellowship in spirit-filled worship and managing technical production.",
      icon: Music
    }
  ];

  return (
    <section className="section-padding bg-zinc-50/50 dark:bg-zinc-950 relative overflow-hidden py-24 md:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pfcu-primary/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />

      <div className="container relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-pfcu-secondary/10 text-pfcu-secondary text-xs font-bold tracking-widest uppercase mb-4">
              Our Ministries
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 tracking-tight text-zinc-900 dark:text-white">
              Serving in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-pfcu-primary to-pfcu-secondary">Vineyard</span>
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 font-light leading-relaxed max-w-xl">
              With 9 specialized departments, there's a perfect place for you to utilize your gifts, serve others, and grow in the body of Christ.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="shrink-0 hidden md:block"
          >
            <Link
              to="/departments"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white transition-all duration-300 bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded-full hover:bg-pfcu-primary hover:scale-[1.02] shadow-lg hover:shadow-xl dark:hover:bg-pfcu-primary dark:hover:text-white"
            >
              View All Departments
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {units.map((unit, index) => (
            <motion.div
              key={unit.name}
              transition={{ delay: index * 0.05 }}
            >
              <UnitCard {...unit} />
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link
            to="/departments"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white transition-all duration-300 bg-zinc-900 rounded-full hover:bg-pfcu-primary shadow-lg"
          >
            View All Departments
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UnitsSection;
