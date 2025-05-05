
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
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="p-6 flex flex-col items-center text-center">
        <Avatar className="w-24 h-24 border-2 border-pfcu-light mb-4">
          {leader.profileImage ? (
            <AvatarImage src={leader.profileImage} alt={leader.name} className="object-cover" />
          ) : (
            <AvatarFallback className="bg-gradient-to-br from-pfcu-purple to-pfcu-dark text-white text-xl font-bold">
              {leader.initial}
            </AvatarFallback>
          )}
        </Avatar>
        
        <h3 className="text-lg font-bold mb-1">{leader.name}</h3>
        <div className="px-3 py-1 bg-pfcu-light text-pfcu-purple text-sm font-medium rounded-full mb-3">
          {leader.position}
        </div>
        
        {leader.bio && (
          <p className="text-sm text-gray-600 mt-2 mb-3">{leader.bio}</p>
        )}
        
        {leader.socialMedia && (
          <div className="flex justify-center gap-3 mt-2">
            {leader.socialMedia.facebook && (
              <a 
                href={leader.socialMedia.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Facebook size={16} />
              </a>
            )}
            {leader.socialMedia.twitter && (
              <a 
                href={leader.socialMedia.twitter} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-sky-500 transition-colors"
              >
                <TwitterIcon size={16} />
                <span className="sr-only">X (formerly Twitter)</span>
              </a>
            )}
            {leader.socialMedia.instagram && (
              <a 
                href={leader.socialMedia.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-pink-600 transition-colors"
              >
                <Instagram size={16} />
              </a>
            )}
            {leader.socialMedia.linkedin && (
              <a 
                href={leader.socialMedia.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-700 transition-colors"
              >
                <Linkedin size={16} />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LeaderCard;
