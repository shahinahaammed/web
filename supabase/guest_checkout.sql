-- Run this once in Supabase SQL Editor to enable guest checkout.
-- Guest orders use customer_id = NULL and are visible to admins.

drop policy if exists "guest create orders" on public.orders;
create policy "guest create orders" on public.orders
for insert to anon
with check (customer_id is null);

grant insert on public.orders to anon;
