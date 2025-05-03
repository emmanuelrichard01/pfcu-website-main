
import { Card, CardContent } from "@/components/ui/card";
import { Church, BookOpen, Users, Music, School, HandHeart, Video, Image } from "lucide-react";
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
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full border-t-2 border-t-pfcu-purple/30 hover:border-t-pfcu-purple">
        <CardContent className="p-6 h-full flex flex-col">
          <div className="mb-4 text-pfcu-purple group-hover:text-pfcu-gold transition-colors bg-pfcu-light p-3 rounded-full w-16 h-16 flex items-center justify-center">
            <Icon size={36} />
          </div>
          <h3 className="font-display text-xl font-bold mb-2">{name}</h3>
          <p className="text-gray-600 text-sm flex-grow">{description}</p>
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
    <section className="section-padding bg-pfcu-light">
      <div className="container">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Our Ministry Units</h2>
          <p className="section-subtitle">
            16 units working together to build the body of Christ
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {units.map((unit, index) => (
            <motion.div
              key={unit.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <UnitCard {...unit} />
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link 
            to="/units" 
            className="inline-flex items-center bg-pfcu-purple hover:bg-pfcu-dark text-white px-6 py-3 rounded-md transition-all duration-300 hover:shadow-lg group"
          >
            View All 16 Ministry Units
            <svg className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default UnitsSection;
