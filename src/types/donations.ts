
export interface Donation {
  id: string;
  donorName: string;
  amount: number;
  date: string;
  purpose: string;
  status: "completed" | "pending" | "failed";
  paymentMethod: "Bank Transfer" | "Cash" | "Online Payment";
  email?: string;
  phone?: string;
}

export type NewDonation = Omit<Donation, "id">;
