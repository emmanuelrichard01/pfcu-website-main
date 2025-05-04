
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
      className="relative overflow-hidden rounded-xl shadow-lg bg-white"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
    >
      <div className="h-32 bg-gradient-to-r from-pfcu-purple to-pfcu-dark"></div>
      
      <div className="px-6 pb-6 -mt-16 flex flex-col items-center">
        <Avatar className="w-32 h-32 border-4 border-white mb-4 shadow-xl">
          {leader.profileImage ? (
            <AvatarImage src={leader.profileImage} alt={leader.name} className="object-cover" />
          ) : (
            <AvatarFallback className="bg-gradient-to-br from-pfcu-gold to-amber-500 text-white text-2xl font-bold">
              {leader.initial}
            </AvatarFallback>
          )}
        </Avatar>
        
        <h3 className="font-display text-xl font-bold mb-1 text-center">{leader.name}</h3>
        <div className="px-3 py-1 bg-pfcu-light text-pfcu-purple text-sm font-medium rounded-full mb-3">
          {leader.position}
        </div>
        
        {leader.bio && (
          <p className="text-sm text-gray-600 mt-2 text-center max-w-xs">{leader.bio}</p>
        )}
        
        {leader.socialMedia && (
          <div className="flex justify-center gap-4 mt-4">
            {leader.socialMedia.facebook && (
              <motion.a 
                href={leader.socialMedia.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.2 }}
              >
                <Facebook size={18} />
              </motion.a>
            )}
            {leader.socialMedia.twitter && (
              <motion.a 
                href={leader.socialMedia.twitter} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-sky-500 transition-colors"
                whileHover={{ scale: 1.2 }}
              >
                <TwitterIcon size={18} />
                <span className="sr-only">X (formerly Twitter)</span>
              </motion.a>
            )}
            {leader.socialMedia.instagram && (
              <motion.a 
                href={leader.socialMedia.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-pink-600 transition-colors"
                whileHover={{ scale: 1.2 }}
              >
                <Instagram size={18} />
              </motion.a>
            )}
            {leader.socialMedia.linkedin && (
              <motion.a 
                href={leader.socialMedia.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-700 transition-colors"
                whileHover={{ scale: 1.2 }}
              >
                <Linkedin size={18} />
              </motion.a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LeaderCard;
