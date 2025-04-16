
import { useState, useEffect } from "react";
import { Donation } from "@/types/donations";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDonations = async () => {
    setLoading(true);
    try {
      // Try to fetch donations from Supabase if table exists
      // For now, we skip this since the table doesn't exist in schema
      // Instead, we'll just use localStorage
      
      const storedDonations = localStorage.getItem("pfcu_donations");
      if (storedDonations) {
        setDonations(JSON.parse(storedDonations));
      } else {
        initializeMockData();
      }
    } catch (error) {
      // Fall back to localStorage if there's any error
      const storedDonations = localStorage.getItem("pfcu_donations");
      if (storedDonations) {
        setDonations(JSON.parse(storedDonations));
      } else {
        initializeMockData();
      }
    } finally {
      setLoading(false);
    }
  };

  const initializeMockData = () => {
    const mockDonations: Donation[] = [
      {
        id: "1",
        donorName: "James Okafor",
        amount: 50000,
        date: "2025-04-01",
        purpose: "General Offering",
        status: "completed",
        paymentMethod: "Bank Transfer",
        email: "james@example.com",
        phone: "+234 801 234 5678"
      },
      {
        id: "2",
        donorName: "Charity Eze",
        amount: 20000,
        date: "2025-04-05",
        purpose: "Project Support",
        status: "completed",
        paymentMethod: "Cash",
        phone: "+234 802 345 6789"
      },
      {
        id: "3",
        donorName: "David Adebayo",
        amount: 35000,
        date: "2025-04-08",
        purpose: "Special Offering",
        status: "completed",
        paymentMethod: "Online Payment",
        email: "david@example.com"
      },
      {
        id: "4",
        donorName: "Mary Johnson",
        amount: 15000,
        date: "2025-04-10",
        purpose: "General Offering",
        status: "completed",
        paymentMethod: "Cash"
      },
      {
        id: "5",
        donorName: "Emmanuel Nwosu",
        amount: 25000,
        date: "2025-04-12",
        purpose: "Project Support",
        status: "pending",
        paymentMethod: "Bank Transfer",
        email: "emmanuel@example.com",
        phone: "+234 803 456 7890"
      },
      {
        id: "6",
        donorName: "Grace Udoh",
        amount: 40000,
        date: "2025-04-13",
        purpose: "Special Offering",
        status: "completed",
        paymentMethod: "Bank Transfer",
        email: "grace@example.com",
        phone: "+234 804 567 8901"
      }
    ];
    
    setDonations(mockDonations);
    localStorage.setItem("pfcu_donations", JSON.stringify(mockDonations));
  };

  const addDonation = async (newDonation: Omit<Donation, "id">) => {
    try {
      const id = `${donations.length + 1}`;
      const newDonationWithId = { ...newDonation, id };
      
      // In the future when 'donations' table exists in Supabase, we'll add here
      
      // Update local state and localStorage
      const updatedDonations = [...donations, newDonationWithId];
      setDonations(updatedDonations);
      localStorage.setItem("pfcu_donations", JSON.stringify(updatedDonations));
      
      toast({
        title: "Donation added",
        description: "The new donation has been added successfully.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error adding donation",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteDonation = async (id: string) => {
    try {
      // In the future when 'donations' table exists in Supabase, we'll delete here
      
      // Update local state and localStorage
      const updatedDonations = donations.filter(d => d.id !== id);
      setDonations(updatedDonations);
      localStorage.setItem("pfcu_donations", JSON.stringify(updatedDonations));
      
      toast({
        title: "Donation deleted",
        description: "The donation has been deleted successfully.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error deleting donation",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  // Initialize donations on component mount
  useEffect(() => {
    fetchDonations();
  }, []);

  return {
    donations,
    loading,
    fetchDonations,
    addDonation,
    deleteDonation
  };
};
