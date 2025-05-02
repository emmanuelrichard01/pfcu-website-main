
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
      
      // Use RPC to add donation with admin rights
      const { data, error } = await supabase
        .rpc('admin_add_donation', donationData);
      
      if (error) {
        console.error("RPC error:", error);
        // Fall back to direct insertion
        const { data: insertData, error: insertError } = await supabase
          .from('donations')
          .insert([donationData])
          .select('*')
          .single();
          
        if (insertError) throw insertError;
        
        // Convert inserted data to our format
        const newDonationWithId: Donation = {
          id: insertData.id,
          donorName: insertData.donor_name,
          amount: Number(insertData.amount),
          date: insertData.date,
          purpose: insertData.purpose,
          status: insertData.status as "completed" | "pending" | "failed",
          paymentMethod: insertData.payment_method as "Bank Transfer" | "Cash" | "Online Payment",
          email: insertData.email || undefined,
          phone: insertData.phone || undefined,
          paymentReference: insertData.payment_reference || undefined,
          paymentGateway: insertData.payment_gateway as "Paystack" | "Flutterwave" | "Direct Deposit" | undefined,
        };
        
        // Update local state
        setDonations(prev => [newDonationWithId, ...prev]);
      } else {
        // Refresh the entire list to get the newly added donation
        fetchDonations();
      }
      
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

  const updateDonation = async (id: string, updatedData: Partial<Donation>) => {
    try {
      // Convert our data model to Supabase schema
      const donationData: any = {};
      
      if (updatedData.donorName !== undefined) donationData.donor_name = updatedData.donorName;
      if (updatedData.email !== undefined) donationData.email = updatedData.email || null;
      if (updatedData.phone !== undefined) donationData.phone = updatedData.phone || null;
      if (updatedData.amount !== undefined) donationData.amount = updatedData.amount;
      if (updatedData.purpose !== undefined) donationData.purpose = updatedData.purpose;
      if (updatedData.paymentMethod !== undefined) donationData.payment_method = updatedData.paymentMethod;
      if (updatedData.paymentReference !== undefined) donationData.payment_reference = updatedData.paymentReference || null;
      if (updatedData.paymentGateway !== undefined) donationData.payment_gateway = updatedData.paymentGateway || null;
      if (updatedData.status !== undefined) donationData.status = updatedData.status;
      if (updatedData.date !== undefined) donationData.date = updatedData.date;
      
      // Use RPC to update donation with admin rights
      const { error } = await supabase
        .rpc('admin_update_donation', { 
          donation_id: id,
          ...donationData
        });
      
      if (error) {
        console.error("RPC error:", error);
        // Fall back to direct update
        const { error: updateError } = await supabase
          .from('donations')
          .update(donationData)
          .eq('id', id);
          
        if (updateError) throw updateError;
      }
      
      // Update local state
      const updatedDonations = donations.map(donation => 
        donation.id === id ? { ...donation, ...updatedData } : donation
      );
      
      setDonations(updatedDonations);
      
      toast({
        title: "Donation updated",
        description: "The donation has been updated successfully."
      });
      
      return true;
    } catch (error: any) {
      console.error("Error updating donation:", error);
      toast({
        title: "Error updating donation",
        description: error.message || "Failed to update donation",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteDonation = async (id: string) => {
    try {
      // Use RPC to delete donation with admin rights
      const { error } = await supabase
        .rpc('admin_delete_donation', { donation_id: id });
      
      if (error) {
        console.error("RPC error:", error);
        // Fall back to direct deletion
        const { error: deleteError } = await supabase
          .from('donations')
          .delete()
          .eq('id', id);
          
        if (deleteError) throw deleteError;
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
    updateDonation,
    deleteDonation
  };
};
