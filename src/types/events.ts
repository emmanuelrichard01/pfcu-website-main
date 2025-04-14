
export interface Event {
  id: string;
  title: string;
  description: string;
  full_description?: string | null;
  date: string;
  time: string;
  location: string;
  category: "Service" | "Bible Study" | "Prayer" | "Outreach" | "Social" | "Conference";
  organizer?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventFormValues {
  title: string;
  description: string;
  full_description?: string | null;
  date: string;
  time: string;
  location: string;
  category: "Service" | "Bible Study" | "Prayer" | "Outreach" | "Social" | "Conference";
  organizer?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  is_featured: boolean;
}
