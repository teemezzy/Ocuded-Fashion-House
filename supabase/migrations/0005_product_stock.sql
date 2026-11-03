-- O_Cubed — product inventory (stock cap + units sold).

alter table products
  add column if not exists stock integer not null default 0,  -- total units that can be sold
  add column if not exists sold  integer not null default 0;  -- units sold so far

-- Atomically reserve one unit for a paid order. Returns true if reserved.
create or replace function increment_product_sold(p_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  ok boolean;
begin
  update products
    set sold = sold + 1
    where id = p_id and sold < stock
    returning true into ok;
  return coalesce(ok, false);
end;
$$;
