
-- Create a function to help set up storage policies
CREATE OR REPLACE FUNCTION public.create_public_bucket_policy(bucket_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name, public)
  VALUES (bucket_name, bucket_name, true)
  ON CONFLICT (id) DO NOTHING;
  
  -- Allow public read access to files in this bucket
  EXECUTE format('
    CREATE POLICY "Allow public read access to %I bucket" 
    ON storage.objects 
    FOR SELECT 
    TO public 
    USING (bucket_id = %L);
  ', bucket_name, bucket_name);
  
  -- Allow authenticated users to upload to this bucket
  EXECUTE format('
    CREATE POLICY "Allow authenticated users to upload to %I bucket" 
    ON storage.objects 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (bucket_id = %L);
  ', bucket_name, bucket_name);
  
  -- Allow authenticated users to update their own files
  EXECUTE format('
    CREATE POLICY "Allow authenticated users to update their files in %I bucket" 
    ON storage.objects 
    FOR UPDATE 
    TO authenticated 
    USING (bucket_id = %L AND owner = auth.uid());
  ', bucket_name, bucket_name);
  
  -- Allow authenticated users to delete their own files
  EXECUTE format('
    CREATE POLICY "Allow authenticated users to delete their files in %I bucket" 
    ON storage.objects 
    FOR DELETE 
    TO authenticated 
    USING (bucket_id = %L AND owner = auth.uid());
  ', bucket_name, bucket_name);
END;
$$;

-- Create general access policy for sermons bucket if it doesn't exist
DO $$
BEGIN
  -- Create sermons bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('sermons', 'sermons', true)
  ON CONFLICT (id) DO NOTHING;
  
  -- Call the function to create policies for the bucket
  PERFORM create_public_bucket_policy('sermons');
  
  -- Create additional RLS policy to allow admins to access all sermon records
  IF NOT EXISTS (
    SELECT FROM pg_catalog.pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'sermons' 
    AND policyname = 'Admins can view all sermons'
  ) THEN
    CREATE POLICY "Admins can view all sermons" 
    ON public.sermons 
    FOR ALL 
    TO authenticated 
    USING (true);
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating bucket policies: %', SQLERRM;
END;
$$;

-- Grant administrative storage management privileges to authenticated users
DO $$
BEGIN
  ALTER DEFAULT PRIVILEGES IN SCHEMA storage
  GRANT ALL ON TABLES TO authenticated;
  
  GRANT ALL ON SCHEMA storage TO authenticated;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error granting storage privileges: %', SQLERRM;
END;
$$;
