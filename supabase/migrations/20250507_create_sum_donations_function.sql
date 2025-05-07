
-- Function to calculate the sum of completed donations
CREATE OR REPLACE FUNCTION public.sum_completed_donations()
RETURNS numeric
LANGUAGE sql
SECURITY INVOKER
AS $$
  SELECT COALESCE(SUM(amount), 0)
  FROM donations
  WHERE status = 'completed';
$$;
