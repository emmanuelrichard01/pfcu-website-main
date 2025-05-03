
-- Create a storage bucket for profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile_images', 'Profile Images', true);

-- Create a policy to allow any authenticated user to upload images
CREATE POLICY "Anyone can upload profile images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile_images');

-- Create a policy to allow reading profile images
CREATE POLICY "Profile images are publicly accessible"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile_images');
