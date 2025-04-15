
export interface Event {
  id: string;
  title: string;
  description: string;
  full_description?: string | null;
  date: string;
  time: string;
  location: string;
  category: string; // Changed from union type to string to match Supabase data
  organizer?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export type EventCategory = "Service" | "Bible Study" | "Prayer" | "Outreach" | "Social" | "Conference";

export interface EventFormValues {
  title: string;
  description: string;
  full_description?: string | null;
  date: string;
  time: string;
  location: string;
  category: string; // Change to string to match the database
  organizer?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  is_featured: boolean;
}
