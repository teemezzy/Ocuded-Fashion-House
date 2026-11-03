-- O_Cubed — products, orders, and product-image storage.

-- ---------- products ----------
create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  price       integer not null default 0,   -- NGN
  image_url   text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists products_active_idx on products (active);

-- ---------- orders ----------
create table if not exists orders (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid references products(id) on delete set null,
  product_title  text,
  customer_name  text not null,
  customer_email text not null,
  customer_phone text,
  amount         integer not null,
  paystack_ref   text unique,
  status         text not null default 'pending',  -- pending | paid
  fulfilled      boolean not null default false,
  fulfilled_at   timestamptz,
  created_at     timestamptz not null default now()
);
create index if not exists orders_fulfilled_idx on orders (fulfilled);
create index if not exists orders_status_idx on orders (status);

-- ---------- RLS ----------
alter table products enable row level security;
alter table orders   enable row level security;

drop policy if exists "public read products" on products;
create policy "public read products" on products
  for select using (active = true);

drop policy if exists "admin all products" on products;
create policy "admin all products" on products
  for all using (is_admin()) with check (is_admin());

-- Anyone may create a (pending) order at checkout.
drop policy if exists "public create order" on orders;
create policy "public create order" on orders
  for insert with check (true);

drop policy if exists "admin all orders" on orders;
create policy "admin all orders" on orders
  for all using (is_admin()) with check (is_admin());

-- ---------- storage bucket for product images ----------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "admin upload product images" on storage.objects;
create policy "admin upload product images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and is_admin());

drop policy if exists "admin change product images" on storage.objects;
create policy "admin change product images" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and is_admin());

drop policy if exists "admin delete product images" on storage.objects;
create policy "admin delete product images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and is_admin());
