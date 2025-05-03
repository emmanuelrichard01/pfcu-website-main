
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Facebook, Twitter as TwitterIcon, Instagram, Linkedin } from "lucide-react";

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
              <TwitterIcon size={16} />
              <span className="sr-only">X (formerly Twitter)</span>
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

export default LeaderCard;
