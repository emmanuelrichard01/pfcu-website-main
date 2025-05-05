
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Leader } from "@/types/leadership";

interface LeaderCardProps {
  leader: Leader;
  index: number;
}

const LeaderCard = ({ leader, index }: LeaderCardProps) => {
  return (
    <motion.div 
      className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="p-5 flex flex-col items-center text-center">
        <Avatar className="h-20 w-20 mb-3">
          {leader.profileImage ? (
            <AvatarImage src={leader.profileImage} alt={leader.name} className="object-cover" />
          ) : (
            <AvatarFallback className="bg-pfcu-purple text-white text-lg font-bold">
              {leader.initial}
            </AvatarFallback>
          )}
        </Avatar>
        
        <h3 className="text-lg font-bold mb-1">{leader.name}</h3>
        <span className="text-sm text-pfcu-purple font-medium mb-2">
          {leader.position}
        </span>
        
        {leader.bio && (
          <p className="text-sm text-gray-600 mt-1 mb-2">{leader.bio}</p>
        )}
        
        {leader.socialMedia && Object.values(leader.socialMedia).some(Boolean) && (
          <div className="flex gap-2 mt-2">
            {leader.socialMedia.facebook && (
              <a 
                href={leader.socialMedia.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={14} />
              </a>
            )}
            {leader.socialMedia.twitter && (
              <a 
                href={leader.socialMedia.twitter} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-sky-500 transition-colors"
                aria-label="X (formerly Twitter)"
              >
                <Twitter size={14} />
              </a>
            )}
            {leader.socialMedia.instagram && (
              <a 
                href={leader.socialMedia.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={14} />
              </a>
            )}
            {leader.socialMedia.linkedin && (
              <a 
                href={leader.socialMedia.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={14} />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LeaderCard;
