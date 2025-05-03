
import { useState, useEffect } from "react";
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

export const useLeadershipData = () => {
  const [leaders, setLeaders] = useState<LeaderData[]>([]);
  const [tenureInfo, setTenureInfo] = useState({
    year: "2024/2025",
    declaration: "Many but one in Christ"
  });
  const [loading, setLoading] = useState(true);

  // Function to sort leaders according to the specified hierarchy
  const sortLeadersByHierarchy = (leadersList: LeaderData[]): LeaderData[] => {
    const positionOrder: Record<string, number> = {
      "Pastor/President": 1,
      "Assistant Pastor/VP": 2,
      "General Secretary": 3,
      "Assistant Secretary & Treasurer": 4,
      "P.R.O & Financial Secretary": 5,
      "Provost": 6
    };
    
    return [...leadersList].sort((a, b) => {
      const posA = positionOrder[a.position] || 99;
      const posB = positionOrder[b.position] || 99;
      return posA - posB;
    });
  };

  useEffect(() => {
    const fetchLeaders = async () => {
      setLoading(true);
      
      try {
        // Try to fetch leaders from Supabase database
        const { data, error } = await supabase
          .from('leaders')
          .select('*');
          
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
          
          // Sort leaders according to the specified hierarchy
          const sortedLeaders = sortLeadersByHierarchy(mappedLeaders);
          setLeaders(sortedLeaders);
        } else {
          // Fallback to localStorage if needed
          const storedLeaders = localStorage.getItem("pfcu_leaders");
          
          if (storedLeaders) {
            const parsedLeaders = JSON.parse(storedLeaders);
            // Sort leaders according to the specified hierarchy
            const sortedLeaders = sortLeadersByHierarchy(parsedLeaders);
            setLeaders(sortedLeaders);
          } else {
            // Default leaders with the correct hierarchy
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
                position: "Assistant Secretary & Treasurer",
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
        }
      } catch (error) {
        console.error("Error fetching leaders:", error);
        
        // Fallback to localStorage if needed
        const storedLeaders = localStorage.getItem("pfcu_leaders");
        if (storedLeaders) {
          const parsedLeaders = JSON.parse(storedLeaders);
          const sortedLeaders = sortLeadersByHierarchy(parsedLeaders);
          setLeaders(sortedLeaders);
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
        declaration: parsedTenure.slogan || parsedTenure.declaration || "Many but one in Christ" // Convert slogan to declaration
      });
    }
    
    fetchLeaders();
  }, []);

  return { leaders, loading, tenureInfo };
};
