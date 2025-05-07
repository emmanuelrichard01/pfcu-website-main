
import { supabase } from "@/integrations/supabase/client";
import { Donation } from "@/types/donations";

export const fetchDonationsFromDatabase = async () => {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const insertDonation = async (donationData: {
  donor_name: string;
  email: string | null;
  phone: string | null;
  amount: number;
  purpose: string;
  payment_method: string;
  payment_reference: string | null;
  payment_gateway: string | null;
  status: string;
  date: string;
}) => {
  const { data, error } = await supabase
    .from('donations')
    .insert([donationData])
    .select('*')
    .single();
      
  if (error) throw error;
  return data;
};

export const updateDonationInDatabase = async (id: string, donationData: any) => {
  const { error } = await supabase
    .from('donations')
    .update(donationData)
    .eq('id', id);
      
  if (error) throw error;
  return true;
};

export const deleteDonationFromDatabase = async (id: string) => {
  const { error } = await supabase
    .from('donations')
    .delete()
    .eq('id', id);
      
  if (error) throw error;
  return true;
};

export const formatDonationFromDatabase = (item: any): Donation => ({
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
});

export const formatDonationForDatabase = (donation: Omit<Donation, "id">) => ({
  donor_name: donation.donorName,
  email: donation.email || null,
  phone: donation.phone || null,
  amount: donation.amount,
  purpose: donation.purpose,
  payment_method: donation.paymentMethod,
  payment_reference: donation.paymentReference || null,
  payment_gateway: donation.paymentGateway || null,
  status: donation.status,
  date: donation.date
});

// Calculate total donations for completed donations
export const calculateTotalCompletedDonations = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('amount')
      .eq('status', 'completed');
      
    if (error) throw error;
    
    if (!data || data.length === 0) return 0;
    
    return data.reduce((sum, item) => sum + Number(item.amount), 0);
  } catch (err) {
    console.error("Error calculating total donations:", err);
    return 0;
  }
};
