-- =============================================
-- 1. TABLES
-- =============================================

-- admin_users table
CREATE TABLE public.admin_users (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    is_super_admin boolean DEFAULT false
);

-- donations table
CREATE TABLE public.donations (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    donor_name text NOT NULL,
    email text,
    phone text,
    amount numeric NOT NULL,
    purpose text NOT NULL,
    payment_method text NOT NULL,
    payment_reference text,
    payment_gateway text,
    status text NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- events table
CREATE TABLE public.events (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    title text NOT NULL,
    description text NOT NULL,
    full_description text,
    date text NOT NULL,
    "time" text NOT NULL,
    location text NOT NULL,
    category text NOT NULL,
    organizer text,
    contact_email text,
    contact_phone text,
    is_featured boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- leaders table
CREATE TABLE public.leaders (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name text NOT NULL,
    "position" text NOT NULL,
    initial text NOT NULL,
    bio text,
    profile_image text,
    facebook_url text,
    twitter_url text,
    instagram_url text,
    linkedin_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    position_order integer DEFAULT 99 NOT NULL
);

-- sermons table
CREATE TABLE public.sermons (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    title text NOT NULL,
    preacher text NOT NULL,
    description text,
    sermon_date date NOT NULL,
    duration text,
    cover_image text,
    audio_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- =============================================
-- 2. FUNCTIONS
-- =============================================

-- Function to get user email (security definer to access auth.users)
CREATE OR REPLACE FUNCTION public.get_user_email(user_uid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_email text;
BEGIN
    SELECT email INTO user_email FROM auth.users WHERE id = user_uid;
    RETURN user_email;
END;
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users WHERE user_id = user_uid
    );
END;
$$;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_uid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE user_id = user_uid AND is_super_admin = true
    );
END;
$$;

-- Function to sum completed donations
CREATE OR REPLACE FUNCTION public.sum_completed_donations()
RETURNS numeric
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COALESCE(SUM(amount), 0) FROM public.donations WHERE status = 'completed';
$$;

-- =============================================
-- 3. ENABLE RLS
-- =============================================

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 4. RLS POLICIES
-- =============================================

-- admin_users policies
CREATE POLICY "Allow read access to check admin count"
ON public.admin_users FOR SELECT
USING (true);

CREATE POLICY "Allow admins to create new admins"
ON public.admin_users FOR INSERT
WITH CHECK (
    public.is_admin(auth.uid()) OR (SELECT count(*) FROM public.admin_users) = 0
);

CREATE POLICY "Allow admins to update admin users"
ON public.admin_users FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Allow super admins to delete admin users"
ON public.admin_users FOR DELETE
USING (public.is_super_admin(auth.uid()));

-- donations policies
CREATE POLICY "Admins can view donations"
ON public.donations FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert donations"
ON public.donations FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update donations"
ON public.donations FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete donations"
ON public.donations FOR DELETE
USING (public.is_admin(auth.uid()));

-- events policies
CREATE POLICY "Events are viewable by everyone"
ON public.events FOR SELECT
USING (true);

CREATE POLICY "Admins can insert events"
ON public.events FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update events"
ON public.events FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete events"
ON public.events FOR DELETE
USING (public.is_admin(auth.uid()));

-- leaders policies
CREATE POLICY "Leaders are viewable by everyone"
ON public.leaders FOR SELECT
USING (true);

CREATE POLICY "Admins can insert leaders"
ON public.leaders FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update leaders"
ON public.leaders FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete leaders"
ON public.leaders FOR DELETE
USING (public.is_admin(auth.uid()));

-- sermons policies
CREATE POLICY "Sermons are viewable by everyone"
ON public.sermons FOR SELECT
USING (true);

CREATE POLICY "Admins can insert sermons"
ON public.sermons FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update sermons"
ON public.sermons FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete sermons"
ON public.sermons FOR DELETE
USING (public.is_admin(auth.uid()));