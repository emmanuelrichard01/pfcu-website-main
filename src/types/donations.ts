
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
  paymentReference?: string;
  paymentGateway?: "Paystack" | "Flutterwave" | "Direct Deposit";
}

export type NewDonation = Omit<Donation, "id">;

export interface PaymentOption {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
}

