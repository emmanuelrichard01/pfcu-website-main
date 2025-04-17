
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
      // Fetch donations from Supabase
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Map Supabase data to our Donation type
        const formattedDonations: Donation[] = data.map(item => ({
          id: item.id,
          donorName: item.donor_name,
          amount: Number(item.amount),
          date: item.date,
          purpose: item.purpose,
          status: item.status as "completed" | "pending" | "failed",
          paymentMethod: item.payment_method as "Bank Transfer" | "Cash" | "Online Payment",
          email: item.email || undefined,
          phone: item.phone || undefined,
          paymentReference: item.payment_reference || undefined,
          paymentGateway: item.payment_gateway as "Paystack" | "Flutterwave" | "Direct Deposit" | undefined,
        }));
        
        setDonations(formattedDonations);
      } else {
        // No donations found
        setDonations([]);
      }
    } catch (error: any) {
      console.error("Error fetching donations:", error);
      toast({
        title: "Error fetching donations",
        description: error.message || "Failed to load donations",
        variant: "destructive"
      });
      
      // Fall back to localStorage if there's any error
      const storedDonations = localStorage.getItem("pfcu_donations");
      if (storedDonations) {
        setDonations(JSON.parse(storedDonations));
      }
    } finally {
      setLoading(false);
    }
  };

  const addDonation = async (newDonation: Omit<Donation, "id">) => {
    try {
      // Map our Donation type to Supabase schema
      const donationData = {
        donor_name: newDonation.donorName,
        email: newDonation.email || null,
        phone: newDonation.phone || null,
        amount: newDonation.amount,
        purpose: newDonation.purpose,
        payment_method: newDonation.paymentMethod,
        payment_reference: newDonation.paymentReference || null,
        payment_gateway: newDonation.paymentGateway || null,
        status: newDonation.status,
        date: newDonation.date
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('donations')
        .insert([donationData])
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      // Format the new donation with ID returned from Supabase
      const newDonationWithId: Donation = {
        id: data.id,
        donorName: data.donor_name,
        amount: Number(data.amount),
        date: data.date,
        purpose: data.purpose,
        status: data.status as "completed" | "pending" | "failed",
        paymentMethod: data.payment_method as "Bank Transfer" | "Cash" | "Online Payment",
        email: data.email || undefined,
        phone: data.phone || undefined,
        paymentReference: data.payment_reference || undefined,
        paymentGateway: data.payment_gateway as "Paystack" | "Flutterwave" | "Direct Deposit" | undefined,
      };
      
      // Update local state
      setDonations(prev => [newDonationWithId, ...prev]);
      
      toast({
        title: "Donation added",
        description: "The new donation has been added successfully.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error adding donation:", error);
      
      // Fall back to localStorage if there's any error
      try {
        // Generate a fallback ID
        const id = `local-${Date.now()}`;
        const newDonationWithId = { ...newDonation, id };
        
        // Update local state and localStorage
        const updatedDonations = [newDonationWithId, ...donations];
        setDonations(updatedDonations);
        localStorage.setItem("pfcu_donations", JSON.stringify(updatedDonations));
      } catch (fallbackError) {
        console.error("Even fallback storage failed:", fallbackError);
      }
      
      toast({
        title: "Error adding donation",
        description: error.message || "Failed to add donation to database",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteDonation = async (id: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('donations')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setDonations(donations.filter(d => d.id !== id));
      
      toast({
        title: "Donation deleted",
        description: "The donation has been deleted successfully.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error deleting donation:", error);
      
      // Fall back to localStorage if there's any error
      try {
        // Update local state and localStorage
        const updatedDonations = donations.filter(d => d.id !== id);
        setDonations(updatedDonations);
        localStorage.setItem("pfcu_donations", JSON.stringify(updatedDonations));
      } catch (fallbackError) {
        console.error("Even fallback storage failed:", fallbackError);
      }
      
      toast({
        title: "Error deleting donation",
        description: error.message || "Failed to delete donation",
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
