
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
      className="group relative overflow-hidden rounded-2xl shadow-lg bg-white hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className="h-32 bg-gradient-to-r from-pfcu-purple/90 to-pfcu-dark/90 group-hover:from-pfcu-purple group-hover:to-pfcu-dark transition-all duration-300"></div>
      
      <div className="px-6 pb-6 -mt-16 flex flex-col items-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pfcu-purple/20 to-pfcu-gold/20 rounded-full transform scale-110 blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          <Avatar className="w-32 h-32 border-4 border-white mb-4 shadow-xl transition-transform duration-300 group-hover:scale-105">
            {leader.profileImage ? (
              <AvatarImage src={leader.profileImage} alt={leader.name} className="object-cover" />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-pfcu-gold to-amber-500 text-white text-2xl font-bold">
                {leader.initial}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        
        <h3 className="font-display text-xl font-bold mb-1 text-center group-hover:text-pfcu-purple transition-colors">{leader.name}</h3>
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
                whileHover={{ scale: 1.2, rotate: 5 }}
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
                whileHover={{ scale: 1.2, rotate: 5 }}
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
                whileHover={{ scale: 1.2, rotate: 5 }}
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
                whileHover={{ scale: 1.2, rotate: 5 }}
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
