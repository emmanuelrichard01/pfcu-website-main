
export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  is_super_admin: boolean;
}

export interface AdminFormData {
  email: string;
  password: string;
  confirmPassword: string;
}
