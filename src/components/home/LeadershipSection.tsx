
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Facebook, Twitter as TwitterIcon, Instagram, Linkedin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

const LeadershipSection = () => {
  const [leaders, setLeaders] = useState<LeaderData[]>([]);
  const [tenureInfo, setTenureInfo] = useState({
    year: "2024/2025",
    declaration: "Many but one in Christ"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      setLoading(true);
      
      try {
        // Try to fetch leaders from Supabase database
        const { data, error } = await supabase
          .from('leaders')
          .select('*')
          .order('position');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Map database schema to our interface
          const mappedLeaders: LeaderData[] = data.map(leader => ({
            name: leader.name,
            position: leader.position,
            initial: leader.initial,
            bio: leader.bio || undefined,
            profileImage: leader.profile_image || undefined,
            socialMedia: {
              facebook: leader.facebook_url || undefined,
              twitter: leader.twitter_url || undefined,
              instagram: leader.instagram_url || undefined,
              linkedin: leader.linkedin_url || undefined,
            }
          }));
          
          setLeaders(mappedLeaders);
        } else {
          // Fallback to localStorage if needed
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
            const parsedTenure = JSON.parse(storedTenure);
            setTenureInfo({
              year: parsedTenure.year,
              declaration: parsedTenure.slogan || "Many but one in Christ" // Convert slogan to declaration
            });
          } else {
            localStorage.setItem("pfcu_tenure", JSON.stringify(tenureInfo));
          }
        }
      } catch (error) {
        console.error("Error fetching leaders:", error);
        
        // Fallback to localStorage if needed
        const storedLeaders = localStorage.getItem("pfcu_leaders");
        if (storedLeaders) {
          setLeaders(JSON.parse(storedLeaders));
        }
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch tenure info from localStorage
    const storedTenure = localStorage.getItem("pfcu_tenure");
    if (storedTenure) {
      const parsedTenure = JSON.parse(storedTenure);
      setTenureInfo({
        year: parsedTenure.year,
        declaration: parsedTenure.slogan || "Many but one in Christ" // Convert slogan to declaration
      });
    }
    
    fetchLeaders();
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
            <em>{tenureInfo.declaration}</em> - Our leadership team is dedicated to guiding our fellowship
            through the academic year from June {tenureInfo.year.split('/')[0]} to June {tenureInfo.year.split('/')[1]}.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-pfcu-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {leaders.map((leader, index) => (
              <LeaderCard key={leader.name + index} leader={leader} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LeadershipSection;
