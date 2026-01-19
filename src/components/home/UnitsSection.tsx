
import { Card, CardContent } from "@/components/ui/card";
import { Church, BookOpen, Users, Music, School, HandHeart, Video, Image, ArrowRight } from "lucide-react";
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
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="glass-card h-full border border-white/20 dark:border-white/10 rounded-3xl overflow-hidden group">
        <CardContent className="p-8 h-full flex flex-col items-start relative z-10">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
            <Icon size={120} />
          </div>

          <div className="mb-6 text-white bg-gradient-to-br from-pfcu-primary to-orange-500 p-4 rounded-2xl shadow-lg group-hover:shadow-pfcu-primary/30 transition-all duration-300">
            <Icon size={32} />
          </div>

          <h3 className="font-heading text-2xl font-bold mb-3 text-foreground group-hover:text-pfcu-primary transition-colors">{name}</h3>
          <p className="text-muted-foreground leading-relaxed flex-grow">{description}</p>

          <div className="mt-6 pt-6 w-full border-t border-border/50 flex items-center justify-between text-pfcu-primary font-medium opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <span>Learn more</span>
            <ArrowRight size={18} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const UnitsSection = () => {
  const units = [
    {
      name: "Academic Unit",
      description: "Supporting students in their academic pursuits through study groups and resources.",
      icon: School
    },
    {
      name: "Bible Study Unit",
      description: "Facilitating in-depth study and understanding of the Word of God.",
      icon: BookOpen
    },
    {
      name: "Choir Unit",
      description: "Leading worship and creating an atmosphere of praise through music.",
      icon: Music
    },
    {
      name: "Prayer Unit",
      description: "Interceding for the fellowship, university, and beyond.",
      icon: Church
    },
    {
      name: "Evangelism Unit",
      description: "Sharing the gospel and reaching out to the campus community.",
      icon: Users
    },
    {
      name: "Welfare Unit",
      description: "Providing support and care for the needs of fellowship members.",
      icon: HandHeart
    },
    {
      name: "Drama Unit",
      description: "Using theatrical arts to convey spiritual messages and truths.",
      icon: Video
    },
    {
      name: "Technical Unit",
      description: "Managing audio, visual, and technical aspects of the fellowship.",
      icon: Image
    }
  ];

  return (
    <section className="section-padding bg-muted/30 relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />

      <div className="container relative z-10">
        <motion.div
          className="text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="text-pfcu-primary font-semibold tracking-wider uppercase mb-2 block">Ministry Arms</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Serving in the Vineyard</h2>
          <p className="text-xl text-muted-foreground font-light">
            With 16 vibrant ministry units, there's a perfect place for you to serve, grow, and impact lives in the body of Christ.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {units.map((unit, index) => (
            <motion.div
              key={unit.name}
              transition={{ delay: index * 0.05 }}
            >
              <UnitCard {...unit} />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link
            to="/units"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white transition-all duration-200 bg-pfcu-primary rounded-full hover:bg-pfcu-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pfcu-primary shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Explore All 16 Ministry Units
            <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default UnitsSection;
