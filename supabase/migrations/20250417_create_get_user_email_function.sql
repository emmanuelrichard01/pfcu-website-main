
-- Create a function to securely get a user's email
CREATE OR REPLACE FUNCTION public.get_user_email(user_uid UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    user_email TEXT;
BEGIN
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = user_uid;
    
    RETURN user_email;
END;
$$;

-- Create a view to make it easier to query user emails
CREATE OR REPLACE VIEW public.auth_user_emails AS
SELECT 
  id as user_id, 
  email 
FROM 
  auth.users;
