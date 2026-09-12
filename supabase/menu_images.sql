-- Run once in Supabase SQL Editor to enable persistent menu images.
alter table public.menu_items add column if not exists image_url text;
