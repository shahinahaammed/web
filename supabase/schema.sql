-- Bayah Seafood backend: Supabase Auth + PostgreSQL
-- Run this once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id text primary key,
  category text not null,
  name text not null,
  description text not null default '',
  price numeric(10,2) not null check (price >= 0),
  popular boolean not null default false,
  available boolean not null default true,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  order_number text primary key,
  customer_id uuid references auth.users(id) on delete set null,
  order_type text not null check (order_type in ('dine-in', 'takeaway', 'delivery')),
  form jsonb not null default '{}'::jsonb,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(10,2) not null default 0,
  delivery_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  status text not null default 'New' check (status in ('New','Pending','Preparing','Ready','Completed','Cancelled')),
  created_at timestamptz not null default now()
);

-- Create profile automatically for every new Auth user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.phone, new.raw_user_meta_data->>'phone')
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    phone = excluded.phone;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Helper used by RLS without recursively querying profiles policies.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;

drop policy if exists "profiles own read" on public.profiles;
drop policy if exists "profiles own update" on public.profiles;
drop policy if exists "admin read profiles" on public.profiles;
create policy "profiles own read" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles own update" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id and role = 'customer');
create policy "admin read profiles" on public.profiles for select to authenticated using ((select public.is_admin()));

-- Menu is public-readable; only admins can mutate it.
drop policy if exists "public read menu" on public.menu_items;
drop policy if exists "admin insert menu" on public.menu_items;
drop policy if exists "admin update menu" on public.menu_items;
drop policy if exists "admin delete menu" on public.menu_items;
create policy "public read menu" on public.menu_items for select to anon, authenticated using (true);
create policy "admin insert menu" on public.menu_items for insert to authenticated with check ((select public.is_admin()));
create policy "admin update menu" on public.menu_items for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin delete menu" on public.menu_items for delete to authenticated using ((select public.is_admin()));

-- Customers see only their own orders. Admin sees all and can update statuses.
drop policy if exists "customer read own orders" on public.orders;
drop policy if exists "customer create own orders" on public.orders;
drop policy if exists "guest create orders" on public.orders;
drop policy if exists "admin read all orders" on public.orders;
drop policy if exists "admin update orders" on public.orders;
create policy "customer read own orders" on public.orders for select to authenticated using ((select auth.uid()) = customer_id);
create policy "customer create own orders" on public.orders for insert to authenticated with check ((select auth.uid()) = customer_id);
create policy "guest create orders" on public.orders for insert to anon with check (customer_id is null);
create policy "admin read all orders" on public.orders for select to authenticated using ((select public.is_admin()));
create policy "admin update orders" on public.orders for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- IMPORTANT: after creating your admin Auth user, run:
-- update public.profiles set role = 'admin' where id = 'YOUR_AUTH_USER_UUID';

-- Least-privilege Data API grants. Keep service_role server-side.
revoke all on public.profiles, public.menu_items, public.orders from anon, authenticated;
grant select on public.menu_items to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant insert on public.orders to anon;
grant select, insert, update on public.orders to authenticated;
