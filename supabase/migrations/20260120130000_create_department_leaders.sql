-- Create department_leaders table for managing HOD and Assistant HOD per department
CREATE TABLE IF NOT EXISTS public.department_leaders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    department_name TEXT NOT NULL UNIQUE,
    hod_name TEXT,
    hod_course TEXT,
    hod_level TEXT,
    hod_image TEXT,
    assistant_hod_name TEXT,
    assistant_hod_course TEXT,
    assistant_hod_level TEXT,
    assistant_hod_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.department_leaders ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Allow public read access on department_leaders"
ON public.department_leaders
FOR SELECT
TO public
USING (true);

-- Policy: Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to manage department_leaders"
ON public.department_leaders
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_department_leaders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_department_leaders_updated_at
    BEFORE UPDATE ON public.department_leaders
    FOR EACH ROW
    EXECUTE FUNCTION update_department_leaders_updated_at();

-- Seed initial data for the 9 departments
INSERT INTO public.department_leaders (department_name, hod_name, hod_course, hod_level, assistant_hod_name, assistant_hod_course, assistant_hod_level)
VALUES
    ('Christian Education Department', 'Ogunmilade David Adebayo', 'Computer Engineering', '400 Level', 'Esther Muomelite', 'Computer Engineering', '300 Level'),
    ('Chaplaincy Department', NULL, NULL, NULL, 'Chiazor Nnadi Chisom Oluwatoyin', 'English', '400 Level'),
    ('Beautification Department', 'Okeke Collins Ugochukwu', 'Computer Engineering', '500 Level', 'John Ali Mary Ugbede-Ojo', 'IRPM', '400 Level'),
    ('Media and Communications Department', 'Anthony Favour Ufedo-Ojo', 'Computer Science', '300 Level', NULL, NULL, NULL),
    ('Creative Arts and Performance Department', 'Ituen, Affon Bobby', 'Chemical Engineering', '500 Level', 'Pam Valentina Yeipyeng', 'Microbiology', '400 Level'),
    ('Intercessory Department', 'Oyetunde Segun Israel', 'Estate Management', '400 Level', 'Ojong Bella Valentine', 'Estate Management', '400 Level'),
    ('Outreach and Care Department', 'Daniel Donald-Ogar', 'Computer Engineering', '400 Level', 'Monday Blessing Debekeme', 'Microbiology', '400 Level'),
    ('PFCU Little Angel''s Department', 'Dibie Great', 'Chemical Engineering', '500 Level', 'Ujuetta Angel', 'Microbiology', '400 Level'),
    ('Worship Department', 'Ezinwa-Mbalewe Chibeze', 'Electrical & Electronics Engineering', '400 Level', 'Apeh Peace Ene', 'Architecture', '400 Level')
ON CONFLICT (department_name) DO NOTHING;
