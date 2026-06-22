
-- =====================================================
-- ROLES + PROFILES
-- =====================================================
create type public.app_role as enum ('admin', 'manager', 'employee');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  language text default 'fr',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles self read" on public.profiles for select to authenticated using (true);
create policy "profiles self update" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "profiles self insert" on public.profiles for insert to authenticated with check (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "user_roles read own" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "user_roles admin manage" on public.user_roles for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Auto create profile + first user = admin
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  is_first boolean;
begin
  insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  select (count(*) = 0) into is_first from public.user_roles where role = 'admin';
  if is_first then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'employee');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at helper
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

-- =====================================================
-- CLIENTS / SUPPLIERS
-- =====================================================
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  name text not null,
  company text,
  phone text,
  email text,
  address text,
  nif text, nis text, rc text,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.clients to authenticated;
grant all on public.clients to service_role;
alter table public.clients enable row level security;
create policy "clients all auth" on public.clients for all to authenticated using (true) with check (true);
create trigger clients_touch before update on public.clients for each row execute function public.touch_updated_at();

create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text, email text, address text, notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.suppliers to authenticated;
grant all on public.suppliers to service_role;
alter table public.suppliers enable row level security;
create policy "suppliers all auth" on public.suppliers for all to authenticated using (true) with check (true);
create trigger suppliers_touch before update on public.suppliers for each row execute function public.touch_updated_at();

-- =====================================================
-- CATEGORIES + PRODUCTS
-- =====================================================
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  parent_id uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "categories all auth" on public.categories for all to authenticated using (true) with check (true);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  reference text unique,
  name text not null,
  category_id uuid references public.categories(id) on delete set null,
  unit text default 'unité',
  purchase_price numeric(12,2) default 0,
  sale_price numeric(12,2) default 0,
  wholesale_price numeric(12,2) default 0,
  price_per_sqm numeric(12,2),
  stock numeric(12,2) default 0,
  stock_min numeric(12,2) default 0,
  barcode text,
  photo_url text,
  description text,
  is_calculated boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "products all auth" on public.products for all to authenticated using (true) with check (true);
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();

create table public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  movement_type text not null check (movement_type in ('in','out','loss','adjustment')),
  quantity numeric(12,2) not null,
  unit_price numeric(12,2),
  supplier_id uuid references public.suppliers(id),
  reason text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.stock_movements to authenticated;
grant all on public.stock_movements to service_role;
alter table public.stock_movements enable row level security;
create policy "stock_movements all auth" on public.stock_movements for all to authenticated using (true) with check (true);

-- =====================================================
-- ORDERS / QUOTES / INVOICES
-- =====================================================
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  number text unique,
  client_id uuid references public.clients(id) on delete set null,
  assigned_to uuid references auth.users(id),
  status text not null default 'new' check (status in ('new','validated','design','production','ready','delivered','cancelled')),
  notes text,
  total_ht numeric(12,2) default 0,
  discount numeric(12,2) default 0,
  tax numeric(12,2) default 0,
  total_ttc numeric(12,2) default 0,
  urgent boolean default false,
  delivery_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "orders all auth" on public.orders for all to authenticated using (true) with check (true);
create trigger orders_touch before update on public.orders for each row execute function public.touch_updated_at();

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  designation text not null,
  width numeric(12,2),
  height numeric(12,2),
  quantity numeric(12,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0
);
grant select, insert, update, delete on public.order_items to authenticated;
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;
create policy "order_items all auth" on public.order_items for all to authenticated using (true) with check (true);

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  number text unique,
  client_id uuid references public.clients(id) on delete set null,
  status text default 'pending' check (status in ('pending','accepted','refused','converted')),
  total_ttc numeric(12,2) default 0,
  valid_until date,
  data jsonb,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.quotes to authenticated;
grant all on public.quotes to service_role;
alter table public.quotes enable row level security;
create policy "quotes all auth" on public.quotes for all to authenticated using (true) with check (true);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  number text unique,
  order_id uuid references public.orders(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  type text default 'invoice' check (type in ('invoice','proforma','delivery_note','receipt')),
  total_ttc numeric(12,2) default 0,
  paid_amount numeric(12,2) default 0,
  status text default 'unpaid' check (status in ('unpaid','partial','paid')),
  due_date date,
  data jsonb,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.invoices to authenticated;
grant all on public.invoices to service_role;
alter table public.invoices enable row level security;
create policy "invoices all auth" on public.invoices for all to authenticated using (true) with check (true);

-- =====================================================
-- PAYMENTS / EXPENSES
-- =====================================================
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references public.invoices(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  amount numeric(12,2) not null,
  method text default 'cash' check (method in ('cash','card','bank','check','other')),
  payment_date date not null default current_date,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.payments to authenticated;
grant all on public.payments to service_role;
alter table public.payments enable row level security;
create policy "payments all auth" on public.payments for all to authenticated using (true) with check (true);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  amount numeric(12,2) not null,
  category text,
  expense_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.expenses to authenticated;
grant all on public.expenses to service_role;
alter table public.expenses enable row level security;
create policy "expenses all auth" on public.expenses for all to authenticated using (true) with check (true);

-- =====================================================
-- EMPLOYEES / TASKS / NOTIFICATIONS / LOGS
-- =====================================================
create table public.employees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  phone text, address text, position text,
  salary numeric(12,2),
  photo_url text,
  active boolean default true,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.employees to authenticated;
grant all on public.employees to service_role;
alter table public.employees enable row level security;
create policy "employees all auth" on public.employees for all to authenticated using (true) with check (true);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  assigned_to uuid references auth.users(id),
  status text default 'todo' check (status in ('todo','doing','done')),
  priority text default 'normal' check (priority in ('low','normal','high','urgent')),
  due_date date,
  order_id uuid references public.orders(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.tasks to authenticated;
grant all on public.tasks to service_role;
alter table public.tasks enable row level security;
create policy "tasks all auth" on public.tasks for all to authenticated using (true) with check (true);
create trigger tasks_touch before update on public.tasks for each row execute function public.touch_updated_at();

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  body text,
  type text default 'info',
  read boolean default false,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.notifications to authenticated;
grant all on public.notifications to service_role;
alter table public.notifications enable row level security;
create policy "notifications read own" on public.notifications for select to authenticated using (user_id = auth.uid() or user_id is null);
create policy "notifications insert auth" on public.notifications for insert to authenticated with check (true);
create policy "notifications update own" on public.notifications for update to authenticated using (user_id = auth.uid());

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  action text not null,
  entity text,
  entity_id uuid,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now()
);
grant select, insert on public.activity_logs to authenticated;
grant all on public.activity_logs to service_role;
alter table public.activity_logs enable row level security;
create policy "logs read auth" on public.activity_logs for select to authenticated using (true);
create policy "logs insert auth" on public.activity_logs for insert to authenticated with check (true);

create table public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
grant select on public.settings to authenticated;
grant all on public.settings to service_role;
alter table public.settings enable row level security;
create policy "settings read" on public.settings for select to authenticated using (true);
create policy "settings admin write" on public.settings for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
