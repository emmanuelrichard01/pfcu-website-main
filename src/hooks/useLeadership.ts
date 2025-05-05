import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Leader, LeadershipState } from "@/types/leadership";
import {
  fetchLeadersFromDb,
  getDefaultLeaders,
  addLeaderToDatabase,
  updateLeaderInDatabase,
  deleteLeaderFromDatabase,
  mapDbLeaderToLeader
} from "@/services/leadershipService";

export const useLeadership = () => {
  const [state, setState] = useState<LeadershipState>({
    leaders: [],
    loading: true,
    count: 0
  });
  const { toast } = useToast();

  // Fetch leaders on component mount
  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      // Fetch leaders from the Supabase database
      const fetchedLeaders = await fetchLeadersFromDb();
      
      if (fetchedLeaders.length > 0) {
        setState({
          leaders: fetchedLeaders,
          loading: false,
          count: fetchedLeaders.length
        });
      } else {
        // If no data in database, check localStorage
        const storedLeaders = localStorage.getItem("pfcu_leaders");
        if (storedLeaders) {
          const parsedLeaders = JSON.parse(storedLeaders);
          setState({
            leaders: parsedLeaders,
            loading: false,
            count: parsedLeaders.length
          });
          
          // Migrate localStorage data to database
          parsedLeaders.forEach(async (leader: Leader) => {
            await addLeaderToDatabase(leader);
          });
        } else {
          // Initialize with default leaders
          const defaultLeaders = getDefaultLeaders();
          
          setState({
            leaders: defaultLeaders,
            loading: false,
            count: defaultLeaders.length
          });
          
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
        setState({
          leaders: parsedLeaders,
          loading: false,
          count: parsedLeaders.length
        });
      } else {
        setState({
          leaders: [],
          loading: false,
          count: 0
        });
      }
    }
  };

  const addLeader = async (leader: Omit<Leader, "id">) => {
    try {
      // First, add to Supabase
      const { data, error } = await addLeaderToDatabase(leader);
      
      if (error) throw error;
      
      // Map database response to our interface
      const newLeader = mapDbLeaderToLeader(data);
      
      // Update local state
      const updatedLeaders = [...state.leaders, newLeader];
      setState({
        leaders: updatedLeaders,
        loading: false,
        count: updatedLeaders.length
      });
      
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
        const updatedLeaders = [...state.leaders, newLeader];
        
        setState({
          leaders: updatedLeaders,
          loading: false,
          count: updatedLeaders.length
        });
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
      // Update database first
      const { error } = await updateLeaderInDatabase(id, updatedData);
      
      if (error) throw error;
      
      // Refetch to ensure order is correct instead of updating state directly
      fetchLeaders();
      
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
        const updatedLeadersArray = state.leaders.map(leader => 
          leader.id === id ? { ...leader, ...updatedData } : leader
        );
        
        setState({
          leaders: updatedLeadersArray,
          loading: false,
          count: updatedLeadersArray.length
        });
        localStorage.setItem("pfcu_leaders", JSON.stringify(updatedLeadersArray));
        
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
      const { error } = await deleteLeaderFromDatabase(id);
      
      if (error) throw error;
      
      // Update local state
      const updatedLeaders = state.leaders.filter(leader => leader.id !== id);
      
      setState({
        leaders: updatedLeaders,
        loading: false,
        count: updatedLeaders.length
      });
      
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
        const updatedLeaders = state.leaders.filter(leader => leader.id !== id);
        
        setState({
          leaders: updatedLeaders,
          loading: false,
          count: updatedLeaders.length
        });
        localStorage.setItem("pfcu_leaders", JSON.stringify(updatedLeaders));
        
        return true;
      } catch (fallbackError) {
        console.error("Even fallback storage failed:", fallbackError);
        return false;
      }
    }
  };

  return {
    leaders: state.leaders,
    loading: state.loading,
    count: state.count,
    fetchLeaders,
    addLeader,
    updateLeader,
    deleteLeader
  };
};
