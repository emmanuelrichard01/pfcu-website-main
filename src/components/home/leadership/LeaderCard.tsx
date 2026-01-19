
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";
import { Leader } from "@/types/leadership";

interface LeaderCardProps {
  leader: Leader;
  index: number;
}

const LeaderCard = ({ leader, index }: LeaderCardProps) => {
  return (
    <motion.div
      className="group relative h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="relative h-full overflow-hidden rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 opacity-50" />

        <div className="relative z-10 flex flex-col items-center h-full">
          <Avatar className="h-32 w-32 border-4 border-white dark:border-zinc-950 shadow-lg mb-6">
            {leader.profileImage ? (
              <AvatarImage src={leader.profileImage} alt={leader.name} className="object-cover" />
            ) : (
              <AvatarFallback className="bg-zinc-800 text-zinc-100 text-2xl font-bold font-display">
                {leader.initial}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="mb-2">
            <h3 className="text-xl font-display font-bold text-zinc-900 dark:text-zinc-50">
              {leader.name}
            </h3>
            <p className="text-sm font-medium text-pfcu-primary uppercase tracking-wider">
              {leader.position}
            </p>
          </div>

          {leader.bio && (
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-8 line-clamp-3">
              {leader.bio}
            </p>
          )}

          <div className="mt-auto flex gap-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
            {leader.socialMedia?.facebook && (
              <SocialIcon href={leader.socialMedia.facebook} icon={<Facebook size={18} />} />
            )}
            {leader.socialMedia?.twitter && (
              <SocialIcon href={leader.socialMedia.twitter} icon={<Twitter size={18} />} />
            )}
            {leader.socialMedia?.instagram && (
              <SocialIcon href={leader.socialMedia.instagram} icon={<Instagram size={18} />} />
            )}
            {leader.socialMedia?.linkedin && (
              <SocialIcon href={leader.socialMedia.linkedin} icon={<Linkedin size={18} />} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SocialIcon = ({ href, icon }: { href: string, icon: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-pfcu-primary hover:text-white transition-all duration-300"
  >
    {icon}
  </a>
);

export default LeaderCard;
