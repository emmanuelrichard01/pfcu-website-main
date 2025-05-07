
import { Donation } from "@/types/donations";

export interface DonationsHookReturn {
  donations: Donation[];
  loading: boolean;
  error: string | null;
  fetchDonations: () => Promise<void>;
  addDonation: (newDonation: Omit<Donation, "id">) => Promise<boolean>;
  updateDonation: (id: string, updatedData: Partial<Donation>) => Promise<boolean>;
  updateStatus: (id: string, newStatus: "completed" | "pending" | "failed") => Promise<boolean>;
  deleteDonation: (id: string) => Promise<boolean>;
}

export interface DonationFilters {
  searchQuery?: string;
  status?: string;
  purpose?: string;
  date?: Date;
}
