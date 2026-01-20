-- Allow anyone (including anonymous users) to insert donations
-- This is needed for the public giving page transfer notification form

CREATE POLICY "Anyone can submit a donation notification"
ON public.donations FOR INSERT
WITH CHECK (true);
