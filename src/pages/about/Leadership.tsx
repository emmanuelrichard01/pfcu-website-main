
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
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-none bg-white">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-pfcu-purple to-pfcu-dark h-24 group-hover:from-pfcu-dark group-hover:to-pfcu-purple transition-all duration-500"></div>
          <div className="px-6 pb-6 -mt-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pfcu-purple/20 to-pfcu-gold/20 rounded-full transform scale-110 blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <Avatar className="w-24 h-24 border-4 border-white mb-4 shadow-xl group-hover:scale-105 transition-all duration-300">
                {profileImage ? (
                  <AvatarImage src={profileImage} alt={name} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-pfcu-gold to-amber-500 text-pfcu-dark text-xl font-bold">
                    {initial}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <h3 className="text-xl font-bold mb-1 group-hover:text-pfcu-purple transition-colors">{name}</h3>
            <div className="inline-block px-3 py-1 bg-pfcu-light text-pfcu-purple text-sm font-medium rounded-full mb-3">
              {role}
            </div>
            {bio && <p className="text-gray-600 text-sm mb-4 leading-relaxed">{bio}</p>}
            
            {socialMedia && (
              <div className="flex gap-3 mt-2">
                {socialMedia.facebook && (
                  <motion.a 
                    href={socialMedia.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-500 hover:text-blue-600 transition-all"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                  >
                    <Facebook size={18} />
                  </motion.a>
                )}
                {socialMedia.twitter && (
                  <motion.a 
                    href={socialMedia.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-500 hover:text-sky-500 transition-all"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                  >
                    <TwitterIcon size={18} />
                    <span className="sr-only">X (formerly Twitter)</span>
                  </motion.a>
                )}
                {socialMedia.instagram && (
                  <motion.a 
                    href={socialMedia.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-500 hover:text-pink-600 transition-all"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                  >
                    <Instagram size={18} />
                  </motion.a>
                )}
                {socialMedia.linkedin && (
                  <motion.a 
                    href={socialMedia.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-500 hover:text-blue-700 transition-all"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                  >
                    <Linkedin size={18} />
                  </motion.a>
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
        className="bg-gradient-to-b from-white to-pfcu-light/50 py-16 md:py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pfcu-purple to-pfcu-dark"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              Our Leadership
            </motion.h1>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "5rem" }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="h-1 mx-auto bg-gradient-to-r from-pfcu-purple to-pfcu-gold mb-6"
            />
            <motion.p 
              className="text-xl text-center max-w-3xl mx-auto text-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.7 }}
            >
              Meet the dedicated team guiding our fellowship with vision and purpose.
            </motion.p>
          </div>
        </div>
      </motion.div>

      <section className="py-16">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto mb-12 text-center">
            <motion.h2 
              className="text-3xl font-display font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Current Leadership Team
            </motion.h2>
            <motion.p 
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <strong className="text-pfcu-purple">{tenureInfo.year} Tenure</strong>
            </motion.p>
            <motion.div 
              className="bg-pfcu-light rounded-lg p-4 shadow-inner mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <blockquote className="italic text-pfcu-purple text-center text-lg">
                "{tenureInfo.declaration}"
              </blockquote>
            </motion.div>
          </div>
          
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
