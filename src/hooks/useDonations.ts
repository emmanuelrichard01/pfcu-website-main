
import { useState, useEffect } from "react";
import { Donation } from "@/types/donations";
import { useToast } from "@/hooks/use-toast";
import { DonationsHookReturn } from "@/types/donations/donationTypes";
import { TablesUpdate } from "@/integrations/supabase/types";
import {
  fetchDonationsFromDatabase,
  insertDonation,
  updateDonationInDatabase,
  deleteDonationFromDatabase,
  formatDonationFromDatabase,
  formatDonationForDatabase
} from "@/services/donationService";


export const useDonations = (): DonationsHookReturn => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDonations = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch donations from Supabase
      const data = await fetchDonationsFromDatabase();

      if (data) {
        // Map Supabase data to our Donation type
        const formattedDonations: Donation[] = data.map(formatDonationFromDatabase);
        setDonations(formattedDonations);
      } else {
        // No donations found
        setDonations([]);
      }
    } catch (error: any) {
      console.error("Error fetching donations:", error);
      setError(error.message || "Failed to load donations");
      toast({
        title: "Error fetching donations",
        description: error.message || "Failed to load donations",
        variant: "destructive"
      });

      // Fall back to localStorage if there's any error
      try {
        const storedDonations = localStorage.getItem("pfcu_donations");
        if (storedDonations) {
          setDonations(JSON.parse(storedDonations));
        }
      } catch (localError) {
        console.error("Error loading from localStorage:", localError);
      }
    } finally {
      setLoading(false);
    }
  };

  const addDonation = async (newDonation: Omit<Donation, "id">) => {
    try {
      // Map our Donation type to Supabase schema
      const donationData = formatDonationForDatabase(newDonation);

      // Use direct insertion rather than RPC
      const data = await insertDonation(donationData);

      // Convert inserted data to our format
      if (data) {
        const newDonationWithId: Donation = formatDonationFromDatabase(data);

        // Update local state
        setDonations(prev => [newDonationWithId, ...prev]);
      }

      toast({
        title: "Donation added",
        description: "The new donation has been added successfully.",
      });

      return true;
    } catch (error: any) {
      console.error("Error adding donation:", error);

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
      // Convert our data model to Supabase schema with proper typing
      const donationData: TablesUpdate<'donations'> = {};

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

      await updateDonationInDatabase(id, donationData);

      // Update local state
      const updatedDonations = donations.map(donation =>
        donation.id === id ? { ...donation, ...updatedData } : donation
      );

      setDonations(updatedDonations);

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

  const updateStatus = async (id: string, newStatus: "completed" | "pending" | "failed") => {
    return updateDonation(id, { status: newStatus });
  };

  const deleteDonation = async (id: string) => {
    try {
      await deleteDonationFromDatabase(id);

      // Update local state
      setDonations(donations.filter(d => d.id !== id));

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
    error,
    fetchDonations,
    addDonation,
    updateDonation,
    updateStatus,
    deleteDonation
  };
};
