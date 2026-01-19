-- =============================================
-- 1. FIX SECURITY ISSUES
-- =============================================

-- Drop the overly permissive public SELECT policy on admin_users
DROP POLICY IF EXISTS "Allow read access to check admin count" ON public.admin_users;

-- Create a secure function to check if any admins exist (for setup flow)
CREATE OR REPLACE FUNCTION public.has_admin_users()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(SELECT 1 FROM public.admin_users LIMIT 1);
$$;

-- Update get_user_email to require admin access
CREATE OR REPLACE FUNCTION public.get_user_email(user_uid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_email text;
BEGIN
    -- Only admins can retrieve user emails
    IF NOT public.is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Access denied';
    END IF;
    
    SELECT email INTO user_email FROM auth.users WHERE id = user_uid;
    RETURN user_email;
END;
$$;

-- Add policy for admins to view admin_users
CREATE POLICY "Admins can view admin users"
ON public.admin_users FOR SELECT
USING (public.is_admin(auth.uid()));

-- =============================================
-- 2. CREATE STORAGE BUCKETS
-- =============================================

-- Create profile_images bucket (public read, admin write)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile_images', 'profile_images', true)
ON CONFLICT (id) DO NOTHING;

-- Create sermons bucket (public read, admin write)
INSERT INTO storage.buckets (id, name, public)
VALUES ('sermons', 'sermons', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 3. STORAGE RLS POLICIES
-- =============================================

-- Public read access for profile_images
CREATE POLICY "Public can view profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile_images');

-- Admin-only upload for profile_images
CREATE POLICY "Admins can upload profile images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile_images' AND public.is_admin(auth.uid()));

-- Admin-only update for profile_images
CREATE POLICY "Admins can update profile images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile_images' AND public.is_admin(auth.uid()));

-- Admin-only delete for profile_images
CREATE POLICY "Admins can delete profile images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile_images' AND public.is_admin(auth.uid()));

-- Public read access for sermons
CREATE POLICY "Public can view sermons files"
ON storage.objects FOR SELECT
USING (bucket_id = 'sermons');

-- Admin-only upload for sermons
CREATE POLICY "Admins can upload sermons"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'sermons' AND public.is_admin(auth.uid()));

-- Admin-only update for sermons
CREATE POLICY "Admins can update sermons files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'sermons' AND public.is_admin(auth.uid()));

-- Admin-only delete for sermons
CREATE POLICY "Admins can delete sermons files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'sermons' AND public.is_admin(auth.uid()));