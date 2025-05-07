
import { supabase } from "@/integrations/supabase/client";
import { Donation } from "@/types/donations";

// Fetch all donations from database
export const fetchDonationsFromDatabase = async () => {
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};

// Insert a new donation
export const insertDonation = async (donationData: any) => {
  const { data, error } = await supabase
    .from("donations")
    .insert(donationData)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// Update an existing donation
export const updateDonationInDatabase = async (id: string, donationData: any) => {
  const { error } = await supabase
    .from("donations")
    .update(donationData)
    .eq("id", id);

  if (error) {
    throw error;
  }

  return true;
};

// Delete a donation
export const deleteDonationFromDatabase = async (id: string) => {
  const { error } = await supabase
    .from("donations")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  return true;
};

// Format donation from database to our format
export const formatDonationFromDatabase = (data: any): Donation => {
  return {
    id: data.id,
    donorName: data.donor_name,
    email: data.email,
    phone: data.phone,
    amount: data.amount,
    purpose: data.purpose,
    paymentMethod: data.payment_method,
    paymentReference: data.payment_reference,
    paymentGateway: data.payment_gateway,
    status: data.status,
    date: data.date,
  };
};

// Format donation to database format
export const formatDonationForDatabase = (donation: Omit<Donation, "id">) => {
  return {
    donor_name: donation.donorName,
    email: donation.email || null,
    phone: donation.phone || null,
    amount: donation.amount,
    purpose: donation.purpose,
    payment_method: donation.paymentMethod,
    payment_reference: donation.paymentReference || null,
    payment_gateway: donation.paymentGateway || null,
    status: donation.status,
    date: donation.date,
  };
};

// Calculate total completed donations
export const calculateTotalCompletedDonations = async (): Promise<number> => {
  const { data, error } = await supabase
    .rpc('sum_completed_donations');
    
  if (error) {
    console.error("Error calculating total donations:", error);
    
    // Fallback: query and calculate manually
    const { data: donations, error: fetchError } = await supabase
      .from("donations")
      .select("amount")
      .eq("status", "completed");
      
    if (fetchError) {
      throw fetchError;
    }
    
    return donations?.reduce((sum, donation) => sum + donation.amount, 0) || 0;
  }
  
  return data || 0;
};
