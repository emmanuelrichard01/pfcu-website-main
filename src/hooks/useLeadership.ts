
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

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

  const fetchLeaders = async () => {
    setLoading(true);
    try {
      // For now, we'll just use localStorage since the 'leaders' table doesn't exist in schema
      const storedLeaders = localStorage.getItem("pfcu_leaders");
      if (storedLeaders) {
        const parsedLeaders = JSON.parse(storedLeaders);
        setLeaders(parsedLeaders);
        setCount(parsedLeaders.length);
      } else {
        // Initialize with default leaders if no data in localStorage
        const defaultLeaders = [
          {
            id: "1",
            name: "Emmanuel R.C. Moghalu",
            position: "Pastor/President",
            initial: "EM",
            bio: "Leading with vision and purpose",
          },
          {
            id: "2",
            name: "Chisom C. Mbagwu",
            position: "Assistant Pastor/VP",
            initial: "CM",
            bio: "Supporting the team and community",
          },
          {
            id: "3",
            name: "Joshua E. Aforue",
            position: "General Secretary",
            initial: "JA",
            bio: "Keeping records and documentation",
          },
          {
            id: "4",
            name: "Emmanuella Y. Ufe",
            position: "Asst. Secretary & Treasurer",
            initial: "EU",
            bio: "Managing resources and finances",
          },
          {
            id: "5",
            name: "Dorci F. Donald",
            position: "P.R.O & Financial Secretary",
            initial: "DD",
            bio: "Maintaining public relations",
          },
          {
            id: "6",
            name: "Samuel C. Oyenze",
            position: "Provost",
            initial: "SO",
            bio: "Ensuring order and discipline",
          }
        ];
        
        setLeaders(defaultLeaders);
        setCount(defaultLeaders.length);
        localStorage.setItem("pfcu_leaders", JSON.stringify(defaultLeaders));
      }
    } catch (error: any) {
      toast({
        title: "Error fetching leadership data",
        description: error.message,
        variant: "destructive"
      });
      setLeaders([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };
  
  const addLeader = async (leader: Omit<Leader, "id">) => {
    try {
      const newLeader = { ...leader, id: Date.now().toString() };
      const updatedLeaders = [...leaders, newLeader];
      
      setLeaders(updatedLeaders);
      setCount(updatedLeaders.length);
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
      return false;
    }
  };
  
  const updateLeader = async (id: string, updatedData: Partial<Leader>) => {
    try {
      // Create a deep copy of the leaders array to avoid reference issues
      const leadersCopy = JSON.parse(JSON.stringify(leaders));
      
      // Find the leader by ID
      const updatedLeaders = leadersCopy.map((leader: Leader) => 
        leader.id === id ? { ...leader, ...updatedData } : leader
      );
      
      setLeaders(updatedLeaders);
      localStorage.setItem("pfcu_leaders", JSON.stringify(updatedLeaders));
      
      toast({
        title: "Leader updated successfully",
        description: "The leader's information has been updated."
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error updating leader",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };
  
  const deleteLeader = async (id: string) => {
    try {
      const updatedLeaders = leaders.filter(leader => leader.id !== id);
      
      setLeaders(updatedLeaders);
      setCount(updatedLeaders.length);
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
      return false;
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
