
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

interface LeaderData {
  name: string;
  position: string;
  initial: string;
  bio?: string;
  profileImage?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

interface LeaderCardProps {
  leader: LeaderData;
  index: number;
}

const LeaderCard = ({ leader, index }: LeaderCardProps) => {
  return (
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-pfcu-gold">
        {leader.profileImage ? (
          <AvatarImage src={leader.profileImage} alt={leader.name} />
        ) : (
          <AvatarFallback className="bg-pfcu-purple text-white text-2xl">
            {leader.initial}
          </AvatarFallback>
        )}
      </Avatar>
      <h3 className="font-display text-xl font-bold mb-1">{leader.name}</h3>
      <p className="text-pfcu-purple font-medium">{leader.position}</p>
      
      {leader.bio && (
        <p className="text-sm text-gray-600 mt-1 max-w-xs mx-auto">{leader.bio}</p>
      )}
      
      {leader.socialMedia && (
        <div className="flex justify-center gap-3 mt-3">
          {leader.socialMedia.facebook && (
            <a href={leader.socialMedia.facebook} target="_blank" rel="noopener noreferrer" 
               className="text-gray-500 hover:text-pfcu-purple transition-colors">
              <Facebook size={16} />
            </a>
          )}
          {leader.socialMedia.twitter && (
            <a href={leader.socialMedia.twitter} target="_blank" rel="noopener noreferrer" 
               className="text-gray-500 hover:text-pfcu-purple transition-colors">
              <Twitter size={16} />
            </a>
          )}
          {leader.socialMedia.instagram && (
            <a href={leader.socialMedia.instagram} target="_blank" rel="noopener noreferrer" 
               className="text-gray-500 hover:text-pfcu-purple transition-colors">
              <Instagram size={16} />
            </a>
          )}
          {leader.socialMedia.linkedin && (
            <a href={leader.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" 
               className="text-gray-500 hover:text-pfcu-purple transition-colors">
              <Linkedin size={16} />
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
};

const LeadershipSection = () => {
  const [leaders, setLeaders] = useState<LeaderData[]>([]);
  const [tenureInfo, setTenureInfo] = useState({
    year: "2024/2025",
    slogan: "Many but one in Christ"
  });

  useEffect(() => {
    // In a real app, this would fetch from an API or database
    // For now, we'll use localStorage to demonstrate the admin update functionality
    const storedLeaders = localStorage.getItem("pfcu_leaders");
    const storedTenure = localStorage.getItem("pfcu_tenure");
    
    if (storedLeaders) {
      setLeaders(JSON.parse(storedLeaders));
    } else {
      // Default leaders if none are stored
      const defaultLeaders = [
        {
          name: "Emmanuel R.C. Moghalu",
          position: "Pastor/President",
          initial: "EM",
          bio: "Leading with vision and purpose",
        },
        {
          name: "Chisom C. Mbagwu",
          position: "Assistant Pastor/VP",
          initial: "CM",
          bio: "Supporting the team and community",
        },
        {
          name: "Joshua E. Aforue",
          position: "General Secretary",
          initial: "JA",
          bio: "Keeping records and documentation",
        },
        {
          name: "Emmanuella Y. Ufe",
          position: "Asst. Secretary & Treasurer",
          initial: "EU",
          bio: "Managing resources and finances",
        },
        {
          name: "Dorci F. Donald",
          position: "P.R.O & Financial Secretary",
          initial: "DD",
          bio: "Maintaining public relations",
        },
        {
          name: "Samuel C. Oyenze",
          position: "Provost",
          initial: "SO",
          bio: "Ensuring order and discipline",
        }
      ];
      
      setLeaders(defaultLeaders);
      localStorage.setItem("pfcu_leaders", JSON.stringify(defaultLeaders));
    }
    
    if (storedTenure) {
      setTenureInfo(JSON.parse(storedTenure));
    } else {
      localStorage.setItem("pfcu_tenure", JSON.stringify(tenureInfo));
    }
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Our Leadership</h2>
          <p className="section-subtitle">{tenureInfo.year} Tenure Leadership</p>
          <p className="text-center max-w-2xl mx-auto mb-8 text-gray-600">
            <em>{tenureInfo.slogan}</em> - Our leadership team is dedicated to guiding our fellowship
            through the academic year from June {tenureInfo.year.split('/')[0]} to June {tenureInfo.year.split('/')[1]}.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {leaders.map((leader, index) => (
            <LeaderCard key={leader.name} leader={leader} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
