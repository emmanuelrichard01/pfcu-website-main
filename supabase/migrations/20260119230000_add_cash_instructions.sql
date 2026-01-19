-- Add 'cash_instructions' to site_settings if it doesn't exist
INSERT INTO public.site_settings (key, value, label)
VALUES 
    ('cash_instructions', 'You can give offering in cash during our weekly services or drop it in the offering box located at the entrance.', 'Cash Giving Instructions')
ON CONFLICT (key) DO NOTHING;
