
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
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
        // Fetch leaders from Supabase database, ordered by position_order
        const { data, error } = await supabase
          .from('leaders')
          .select('*')
          .order('position_order', { ascending: true });
          
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
          // Fallback to localStorage if needed
          const storedLeaders = localStorage.getItem("pfcu_leaders");
          
          if (storedLeaders) {
            const parsedLeaders = JSON.parse(storedLeaders);
            setLeaders(parsedLeaders);
          } else {
            // Default leaders with the correct hierarchy
            const defaultLeaders = [
              {
                name: "Emmanuel R.C. Moghalu",
                role: "Pastor/President",
                initial: "EM",
                bio: "Leading with vision and purpose",
              },
              {
                name: "Chisom C. Mbagwu",
                role: "Assistant Pastor/VP",
                initial: "CM",
                bio: "Supporting the team and community",
              },
              {
                name: "Joshua E. Aforue",
                role: "General Secretary",
                initial: "JA",
                bio: "Keeping records and documentation",
              },
              {
                name: "Emmanuella Y. Ufe",
                role: "Assistant Secretary & Treasurer",
                initial: "EU",
                bio: "Managing resources and finances",
              },
              {
                name: "Dorci F. Donald",
                role: "P.R.O & Financial Secretary",
                initial: "DD",
                bio: "Maintaining public relations",
              },
              {
                name: "Samuel C. Oyenze",
                role: "Provost",
                initial: "SO",
                bio: "Ensuring order and discipline",
              }
            ];
            
            setLeaders(defaultLeaders);
          }
        }
      } catch (error) {
        console.error("Error fetching leaders:", error);
        
        // Fallback to localStorage if needed
        const storedLeaders = localStorage.getItem("pfcu_leaders");
        if (storedLeaders) {
          const parsedLeaders = JSON.parse(storedLeaders);
          setLeaders(parsedLeaders);
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
        declaration: parsedTenure.slogan || parsedTenure.declaration || "Many but one in Christ" 
      });
    }
    
    fetchLeaders();
  }, []);

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-white to-pfcu-light/50 py-16 md:py-24">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Our Leadership
            </h1>
            <div className="h-1 w-24 mx-auto bg-pfcu-gold mb-6"></div>
            <p className="text-xl text-center max-w-3xl mx-auto text-gray-700">
              Meet the dedicated team guiding our fellowship with vision and purpose.
            </p>
          </div>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto mb-12 text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Current Leadership Team
            </h2>
            <p className="mb-4">
              <strong className="text-pfcu-purple">{tenureInfo.year} Tenure</strong>
            </p>
            <div className="bg-pfcu-light rounded-lg p-4 shadow-inner mb-8">
              <blockquote className="italic text-pfcu-purple text-center text-lg">
                "{tenureInfo.declaration}"
              </blockquote>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-pfcu-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {leaders.map((leader, index) => (
                <motion.div
                  key={leader.name + index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 flex flex-col items-center text-center">
                    <Avatar className="w-24 h-24 border-2 border-pfcu-light mb-4">
                      {leader.profileImage ? (
                        <AvatarImage src={leader.profileImage} alt={leader.name} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-pfcu-purple to-pfcu-dark text-white text-xl font-bold">
                          {leader.initial}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <h3 className="text-xl font-bold mb-1">{leader.name}</h3>
                    <div className="px-3 py-1 bg-pfcu-light text-pfcu-purple text-sm font-medium rounded-full mb-3">
                      {leader.role}
                    </div>
                    
                    {leader.bio && (
                      <p className="text-sm text-gray-600 mt-2 mb-4">{leader.bio}</p>
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
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Leadership;
