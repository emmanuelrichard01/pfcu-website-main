
import { Card, CardContent } from "@/components/ui/card";
import { Church, BookOpen, Users, Music, Calendar, MessageSquare, Video, Image, Headphones, Heart, School, Pencil, Bell, Package, Shield, HandHeart } from "lucide-react";
import { Link } from "react-router-dom";

interface UnitCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
}

const UnitCard = ({ name, description, icon }: UnitCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <CardContent className="p-6">
        <div className="mb-4 text-pfcu-purple group-hover:text-pfcu-gold transition-colors">
          {icon}
        </div>
        <h3 className="font-display text-xl font-bold mb-2">{name}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

const UnitsSection = () => {
  const units = [
    {
      name: "Academic Unit",
      description: "Supporting students in their academic pursuits through study groups and resources.",
      icon: <School size={36} />
    },
    {
      name: "Bible Study Unit",
      description: "Facilitating in-depth study and understanding of the Word of God.",
      icon: <BookOpen size={36} />
    },
    {
      name: "Choir Unit",
      description: "Leading worship and creating an atmosphere of praise through music.",
      icon: <Music size={36} />
    },
    {
      name: "Prayer Unit",
      description: "Interceding for the fellowship, university, and beyond.",
      icon: <Church size={36} />
    },
    {
      name: "Evangelism Unit",
      description: "Sharing the gospel and reaching out to the campus community.",
      icon: <Users size={36} />
    },
    {
      name: "Welfare Unit",
      description: "Providing support and care for the needs of fellowship members.",
      icon: <HandHeart size={36} />
    },
    {
      name: "Drama Unit",
      description: "Using theatrical arts to convey spiritual messages and truths.",
      icon: <Video size={36} />
    },
    {
      name: "Technical Unit",
      description: "Managing audio, visual, and technical aspects of the fellowship.",
      icon: <Image size={36} />
    }
  ];

  return (
    <section className="section-padding bg-pfcu-light">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="section-title">Our Ministry Units</h2>
          <p className="section-subtitle">
            16 units working together to build the body of Christ
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {units.map((unit) => (
            <UnitCard key={unit.name} {...unit} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/units" 
            className="inline-flex items-center text-pfcu-purple hover:text-pfcu-gold font-medium transition-colors"
          >
            View All 16 Ministry Units
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UnitsSection;
