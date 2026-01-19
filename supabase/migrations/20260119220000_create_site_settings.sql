-- Create site_settings table
create table if not exists public.site_settings (
    key text primary key,
    value text not null,
    label text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.site_settings enable row level security;

-- Policies
create policy "Enable read access for all users"
on "public"."site_settings"
as PERMISSIVE
for SELECT
to public
using (true);

create policy "Enable insert for authenticated users only"
on "public"."site_settings"
as PERMISSIVE
for INSERT
to authenticated
with check (true);

create policy "Enable update for authenticated users only"
on "public"."site_settings"
as PERMISSIVE
for UPDATE
to authenticated
using (true)
with check (true);

-- Seed Default Bank Details
insert into public.site_settings (key, value, label)
values 
    ('bank_name', 'Opay', 'Bank Name'),
    ('account_number', '8155037840', 'Account Number'),
    ('account_name', 'Pentecostal Fellowship of Caritas University', 'Account Name'),
    ('contact_email', 'admin@pfcu.com', 'Contact Email'),
    ('contact_phone', '+234 815 503 7840', 'Contact Phone'),
    ('contact_address', 'Caritas University, Amorji-Nike, Enugu', 'Contact Address')
on conflict (key) do nothing;
