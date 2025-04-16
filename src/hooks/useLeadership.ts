
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
      // Try to fetch leaders from Supabase if table exists
      try {
        const { data, error, count: totalCount } = await supabase
          .from('leaders')
          .select('*', { count: 'exact' });
        
        if (!error && data) {
          setLeaders(data);
          if (totalCount !== null) {
            setCount(totalCount);
          }
          localStorage.setItem("pfcu_leaders", JSON.stringify(data));
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log("Supabase fetch failed or table doesn't exist, using localStorage instead");
      }
      
      // Fall back to localStorage if Supabase table doesn't exist
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
