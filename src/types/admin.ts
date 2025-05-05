
export interface AdminUser {
  id: string;
  user_id: string; // Added to ensure we have the user ID for operations
  email: string;
  created_at: string;
  is_super_admin: boolean;
}

export interface AdminFormData {
  email: string;
  password: string;
}
