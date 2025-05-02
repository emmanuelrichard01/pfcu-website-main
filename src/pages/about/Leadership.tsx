
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Facebook, Twitter as TwitterIcon, Instagram, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface LeaderProps {
  name: string;
  role: string;
  bio?: string;
  initial: string;
  profileImage?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

interface TenureData {
  year: string;
  declaration: string;
}

const LeaderCard = ({ name, role, bio, initial, profileImage, socialMedia }: LeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="bg-pfcu-purple h-24"></div>
          <div className="px-6 pb-6 -mt-12">
            <Avatar className="w-24 h-24 border-4 border-white mb-4 shadow-md">
              {profileImage ? (
                <AvatarImage src={profileImage} alt={name} />
              ) : (
                <AvatarFallback className="bg-pfcu-gold text-pfcu-dark text-xl font-bold">
                  {initial}
                </AvatarFallback>
              )}
            </Avatar>
            <h3 className="text-xl font-bold mb-1">{name}</h3>
            <p className="text-pfcu-purple font-medium mb-3">{role}</p>
            {bio && <p className="text-gray-600 text-sm mb-4">{bio}</p>}
            
            {socialMedia && (
              <div className="flex gap-3">
                {socialMedia.facebook && (
                  <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" 
                     className="text-gray-500 hover:text-pfcu-purple transition-colors">
                    <Facebook size={18} />
                  </a>
                )}
                {socialMedia.twitter && (
                  <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" 
                     className="text-gray-500 hover:text-pfcu-purple transition-colors">
                    <TwitterIcon size={18} />
                    <span className="sr-only">X (formerly Twitter)</span>
                  </a>
                )}
                {socialMedia.instagram && (
                  <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" 
                     className="text-gray-500 hover:text-pfcu-purple transition-colors">
                    <Instagram size={18} />
                  </a>
                )}
                {socialMedia.linkedin && (
                  <a href={socialMedia.linkedin} target="_blank" rel="noopener noreferrer" 
                     className="text-gray-500 hover:text-pfcu-purple transition-colors">
                    <Linkedin size={18} />
                  </a>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Leadership = () => {
  const [leaders, setLeaders] = useState<LeaderProps[]>([]);
  const [tenureInfo, setTenureInfo] = useState<TenureData>({
    year: "2024/2025",
    declaration: "Many but one in Christ"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      setLoading(true);
      try {
        // Try to fetch from Supabase first
        const { data, error } = await supabase
          .from('leaders')
          .select('*')
          .order('position');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Map database schema to our interface
          const mappedLeaders: LeaderProps[] = data.map(leader => ({
            name: leader.name,
            role: leader.position,
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
          // Fallback to localStorage
          const storedLeaders = localStorage.getItem("pfcu_leaders");
          if (storedLeaders) {
            const leaderData = JSON.parse(storedLeaders);
            // Map the data structure if needed
            const formattedLeaders = leaderData.map((leader: any) => ({
              name: leader.name,
              role: leader.position,
              initial: leader.initial,
              bio: leader.bio || "",
              profileImage: leader.profileImage || "",
              socialMedia: leader.socialMedia || {
                instagram: "https://instagram.com/pfcu_"
              }
            }));
            setLeaders(formattedLeaders);
          } else {
            // Fallback data if none exists
            setLeaders([
              {
                name: "Emmanuel R.C. Moghalu",
                role: "Pastor/President",
                bio: "Leading the fellowship with vision and passion since 2024.",
                initial: "EM",
                socialMedia: {
                  instagram: "https://instagram.com/pfcu_"
                }
              },
              {
                name: "Chisom C. Mbagwu",
                role: "Assistant Pastor/VP",
                bio: "Assists in overseeing the daily operations of the fellowship.",
                initial: "CM",
                socialMedia: {
                  instagram: "https://instagram.com/pfcu_"
                }
              },
            ]);
          }
        }
      } catch (error) {
        console.error("Error fetching leaders:", error);
        
        // Fallback to localStorage
        const storedLeaders = localStorage.getItem("pfcu_leaders");
        if (storedLeaders) {
          const formattedLeaders = JSON.parse(storedLeaders).map((leader: any) => ({
            name: leader.name,
            role: leader.position,
            initial: leader.initial,
            bio: leader.bio || "",
            profileImage: leader.profileImage || "",
            socialMedia: leader.socialMedia || {}
          }));
          setLeaders(formattedLeaders);
        }
      } finally {
        setLoading(false);
      }
    };
    
    // Load tenure data from localStorage
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
    <MainLayout>
      <motion.div 
        className="bg-pfcu-light py-16 md:py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-center mb-6 animate-fade-in">Our Leadership</h1>
          <p className="text-xl text-center max-w-3xl mx-auto text-gray-700 animate-fade-in">
            Meet the dedicated team guiding our fellowship with vision and purpose.
          </p>
        </div>
      </motion.div>

      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">Current Leadership Team</h2>
          <p className="text-center max-w-2xl mx-auto mb-8">
            <strong>{tenureInfo.year} Tenure</strong> - <em>{tenureInfo.declaration}</em>
          </p>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-pfcu-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {leaders.map((leader, index) => (
                <LeaderCard 
                  key={leader.name + index} 
                  {...leader} 
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Leadership;
