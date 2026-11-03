-- O_Cubed — gallery / lookbook images.

create table if not exists gallery (
  id         uuid primary key default gen_random_uuid(),
  image_url  text not null,
  caption    text,
  sort       integer not null default 0,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists gallery_active_idx on gallery (active);

alter table gallery enable row level security;

drop policy if exists "public read gallery" on gallery;
create policy "public read gallery" on gallery
  for select using (active = true);

drop policy if exists "admin all gallery" on gallery;
create policy "admin all gallery" on gallery
  for all using (is_admin()) with check (is_admin());

-- storage bucket for gallery images
insert into storage.buckets (id, name, public)
values ('gallery-images', 'gallery-images', true)
on conflict (id) do nothing;

drop policy if exists "public read gallery images" on storage.objects;
create policy "public read gallery images" on storage.objects
  for select using (bucket_id = 'gallery-images');

drop policy if exists "admin upload gallery images" on storage.objects;
create policy "admin upload gallery images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'gallery-images' and is_admin());

drop policy if exists "admin delete gallery images" on storage.objects;
create policy "admin delete gallery images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'gallery-images' and is_admin());
