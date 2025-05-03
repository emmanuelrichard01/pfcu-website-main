import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Leader {
  id?: string;
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

export const useLeadership = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const { toast } = useToast();

  // Define the leadership position hierarchy for sorting
  const positionOrder: Record<string, number> = {
    "Pastor/President": 1,
    "Assistant Pastor/VP": 2,
    "General Secretary": 3,
    "Asst. Secretary & Treasurer": 4,
    "P.R.O & Financial Secretary": 5,
    "Provost": 6
  };

  // Function to sort leaders by position
  const sortLeadersByHierarchy = (leadersList: Leader[]): Leader[] => {
    return [...leadersList].sort((a, b) => {
      const posA = positionOrder[a.position] || 99;
      const posB = positionOrder[b.position] || 99;
      return posA - posB;
    });
  };

  const fetchLeaders = async () => {
    setLoading(true);
    try {
      // Try to fetch leaders from the Supabase database
      const { data, error } = await supabase
        .from('leaders')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Map database schema to our interface
        const mappedLeaders: Leader[] = data.map(leader => ({
          id: leader.id,
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
        setCount(mappedLeaders.length);
      } else {
        // If no data in database, check localStorage
        const storedLeaders = localStorage.getItem("pfcu_leaders");
        if (storedLeaders) {
          const parsedLeaders = JSON.parse(storedLeaders);
          const sortedLeaders = sortLeadersByHierarchy(parsedLeaders);
          setLeaders(sortedLeaders);
          setCount(parsedLeaders.length);
          
          // Migrate localStorage data to database
          parsedLeaders.forEach(async (leader: Leader) => {
            await addLeaderToDatabase(leader);
          });
        } else {
          // Initialize with default leaders
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
          setCount(defaultLeaders.length);
          
          // Add default leaders to database
          defaultLeaders.forEach(async (leader) => {
            await addLeaderToDatabase(leader);
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error fetching leadership data",
        description: error.message,
        variant: "destructive"
      });
      
      // Fallback to localStorage if there's an error
      const storedLeaders = localStorage.getItem("pfcu_leaders");
      if (storedLeaders) {
        const parsedLeaders = JSON.parse(storedLeaders);
        const sortedLeaders = sortLeadersByHierarchy(parsedLeaders);
        setLeaders(sortedLeaders);
        setCount(parsedLeaders.length);
      } else {
        setLeaders([]);
        setCount(0);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to add a leader to the database
  const addLeaderToDatabase = async (leader: Leader) => {
    try {
      const { error } = await supabase.from('leaders').insert({
        name: leader.name,
        position: leader.position,
        initial: leader.initial,
        bio: leader.bio || null,
        profile_image: leader.profileImage || null,
        facebook_url: leader.socialMedia?.facebook || null,
        twitter_url: leader.socialMedia?.twitter || null,
        instagram_url: leader.socialMedia?.instagram || null,
        linkedin_url: leader.socialMedia?.linkedin || null
      });
      
      if (error) {
        console.error("Error migrating leader to database:", error);
      }
    } catch (err) {
      console.error("Error in addLeaderToDatabase:", err);
    }
  };
  
  const addLeader = async (leader: Omit<Leader, "id">) => {
    try {
      // First, add to Supabase
      const { data, error } = await supabase.from('leaders').insert({
        name: leader.name,
        position: leader.position,
        initial: leader.initial,
        bio: leader.bio || null,
        profile_image: leader.profileImage || null,
        facebook_url: leader.socialMedia?.facebook || null,
        twitter_url: leader.socialMedia?.twitter || null,
        instagram_url: leader.socialMedia?.instagram || null,
        linkedin_url: leader.socialMedia?.linkedin || null
      }).select('*').single();
      
      if (error) throw error;
      
      // Map database response to our interface
      const newLeader: Leader = {
        id: data.id,
        name: data.name,
        position: data.position,
        initial: data.initial,
        bio: data.bio || undefined,
        profileImage: data.profile_image || undefined,
        socialMedia: {
          facebook: data.facebook_url || undefined,
          twitter: data.twitter_url || undefined,
          instagram: data.instagram_url || undefined,
          linkedin: data.linkedin_url || undefined,
        }
      };
      
      // Update local state with sorted leaders
      const updatedLeaders = sortLeadersByHierarchy([...leaders, newLeader]);
      setLeaders(updatedLeaders);
      setCount(updatedLeaders.length);
      
      // Keep localStorage in sync for backward compatibility
      localStorage.setItem("pfcu_leaders", JSON.stringify(updatedLeaders));
      
      toast({
        title: "Leader added successfully",
        description: `${leader.name} has been added to the leadership team.`
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error adding leader",
        description: error.message,
        variant: "destructive"
      });
      
      // Try to use localStorage as fallback
      try {
        const newLeader = { ...leader, id: Date.now().toString() };
        const updatedLeaders = sortLeadersByHierarchy([...leaders, newLeader]);
        
        setLeaders(updatedLeaders);
        setCount(updatedLeaders.length);
        localStorage.setItem("pfcu_leaders", JSON.stringify(updatedLeaders));
        
        return true;
      } catch (fallbackError) {
        console.error("Even fallback storage failed:", fallbackError);
        return false;
      }
    }
  };
  
  const updateLeader = async (id: string, updatedData: Partial<Leader>) => {
    try {
      console.log("Updating leader with ID:", id);
      console.log("Updated data:", updatedData);
      
      // Update database first
      const dbUpdateData = {
        name: updatedData.name,
        position: updatedData.position,
        initial: updatedData.initial,
        bio: updatedData.bio,
        profile_image: updatedData.profileImage,
        facebook_url: updatedData.socialMedia?.facebook,
        twitter_url: updatedData.socialMedia?.twitter,
        instagram_url: updatedData.socialMedia?.instagram,
        linkedin_url: updatedData.socialMedia?.linkedin
      };
      
      // Remove undefined values (keep nulls)
      Object.keys(dbUpdateData).forEach(key => {
        if (dbUpdateData[key as keyof typeof dbUpdateData] === undefined) {
          delete dbUpdateData[key as keyof typeof dbUpdateData];
        }
      });
      
      console.log("Database update data:", dbUpdateData);
      
      const { error } = await supabase
        .from('leaders')
        .update(dbUpdateData)
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state - immutably creating a new array with updated leader
      const updatedLeadersArray = leaders.map(leader => 
        leader.id === id ? { ...leader, ...updatedData } : leader
      );
      
      // Sort leaders by hierarchy
      const sortedLeaders = sortLeadersByHierarchy(updatedLeadersArray);
      setLeaders(sortedLeaders);
      
      // Keep localStorage in sync for backward compatibility
      localStorage.setItem("pfcu_leaders", JSON.stringify(sortedLeaders));
      
      toast({
        title: "Leader updated successfully",
        description: "The leader's information has been updated."
      });
      
      return true;
    } catch (error: any) {
      console.error("Error updating leader:", error);
      
      toast({
        title: "Error updating leader",
        description: error.message,
        variant: "destructive"
      });
      
      try {
        // Fallback to direct localStorage update
        const updatedLeadersArray = leaders.map(leader => 
          leader.id === id ? { ...leader, ...updatedData } : leader
        );
        
        const sortedLeaders = sortLeadersByHierarchy(updatedLeadersArray);
        setLeaders(sortedLeaders);
        localStorage.setItem("pfcu_leaders", JSON.stringify(sortedLeaders));
        
        return true;
      } catch (fallbackError) {
        console.error("Even fallback storage failed:", fallbackError);
        return false;
      }
    }
  };
  
  const deleteLeader = async (id: string) => {
    try {
      // Delete from database first
      const { error } = await supabase
        .from('leaders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      const updatedLeaders = leaders.filter(leader => leader.id !== id);
      
      setLeaders(updatedLeaders);
      setCount(updatedLeaders.length);
      
      // Keep localStorage in sync for backward compatibility
      localStorage.setItem("pfcu_leaders", JSON.stringify(updatedLeaders));
      
      toast({
        title: "Leader removed successfully",
        description: "The leader has been removed from the team."
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error removing leader",
        description: error.message,
        variant: "destructive"
      });
      
      try {
        // Fallback to direct localStorage update
        const updatedLeaders = leaders.filter(leader => leader.id !== id);
        
        setLeaders(updatedLeaders);
        setCount(updatedLeaders.length);
        localStorage.setItem("pfcu_leaders", JSON.stringify(updatedLeaders));
        
        return true;
      } catch (fallbackError) {
        console.error("Even fallback storage failed:", fallbackError);
        return false;
      }
    }
  };

  // Fetch leaders on component mount
  useEffect(() => {
    fetchLeaders();
  }, []);

  return {
    leaders,
    loading,
    count,
    fetchLeaders,
    addLeader,
    updateLeader,
    deleteLeader
  };
};
