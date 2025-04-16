
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Leader {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
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
        // Initialize with empty array if no data in localStorage
        setLeaders([]);
        setCount(0);
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

  // Fetch leaders on component mount
  useEffect(() => {
    fetchLeaders();
  }, []);

  return {
    leaders,
    loading,
    count,
    fetchLeaders
  };
};
