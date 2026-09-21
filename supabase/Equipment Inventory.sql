-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).
-- Equipment Inventory for Scan and Learn hospital machines.
-- After scanning a machine in the app, the row is marked scanned and a QR payload is stored.

create table if not exists public.equipment_inventory (
  id text primary key,
  name text not null,
  meaning text,
  what_is_for text,
  category text,
  manufacturer text,
  model text,
  location text,
  purpose text,
  ai_summary text,
  safety jsonb not null default '[]'::jsonb,
  release_date date,
  year_introduced integer,
  release_source text,
  status text not null default 'Available',
  quantity integer not null default 1,
  qr_payload text not null,
  scanned boolean not null default false,
  scanned_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.equipment_inventory
  drop constraint if exists equipment_inventory_status_check;
alter table public.equipment_inventory
  add constraint equipment_inventory_status_check check (status in ('Available', 'Borrowed'));

alter table public.equipment_inventory enable row level security;

drop policy if exists "Authenticated users can view equipment inventory" on public.equipment_inventory;
create policy "Authenticated users can view equipment inventory"
  on public.equipment_inventory
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can insert equipment inventory" on public.equipment_inventory;
create policy "Authenticated users can insert equipment inventory"
  on public.equipment_inventory
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update equipment inventory" on public.equipment_inventory;
create policy "Authenticated users can update equipment inventory"
  on public.equipment_inventory
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete equipment inventory" on public.equipment_inventory;
create policy "Authenticated users can delete equipment inventory"
  on public.equipment_inventory
  for delete
  to authenticated
  using (true);

create or replace function public.touch_equipment_inventory()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  if new.qr_payload is null or btrim(new.qr_payload) = '' then
    new.qr_payload := 'SCANLEARN:' || new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists equipment_inventory_touch on public.equipment_inventory;
create trigger equipment_inventory_touch
  before insert or update on public.equipment_inventory
  for each row execute procedure public.touch_equipment_inventory();

delete from public.equipment_inventory;

notify pgrst, 'reload schema';
