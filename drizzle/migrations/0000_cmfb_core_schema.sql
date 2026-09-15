-- Enums
create type public.app_role as enum ('admin','customer');
create type public.account_status as enum ('PENDING','RESTRICTED','ACTIVE');
create type public.txn_direction as enum ('credit','debit');
create type public.txn_state as enum ('pending','completed','failed');

-- Profiles
create table public.profiles (
  id uuid primary key,
  email text not null,
  full_name text not null default '',
  phone text default '',
  address text default '',
  status public.account_status not null default 'RESTRICTED',
  two_factor_enabled boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

-- Roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "own profile read" on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own profile insert" on public.profiles for insert to authenticated
  with check (id = auth.uid());
create policy "own profile update" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy "admin profile update" on public.profiles for update to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "roles read" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- Accounts
create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  kind text not null default 'checking',
  account_number text not null,
  routing_number text not null default '124300771',
  balance numeric(14,2) not null default 0,
  currency text not null default 'USD',
  created_at timestamptz not null default now()
);
grant select, insert, update on public.accounts to authenticated;
grant all on public.accounts to service_role;
alter table public.accounts enable row level security;
create policy "accounts read" on public.accounts for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- Transactions
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  account_id uuid not null references public.accounts(id) on delete cascade,
  direction public.txn_direction not null,
  amount numeric(14,2) not null check (amount > 0),
  description text not null,
  category text not null default 'General',
  counterparty text default '',
  state public.txn_state not null default 'completed',
  reference text not null default '',
  balance_after numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);
create index on public.transactions (user_id, created_at desc);
grant select on public.transactions to authenticated;
grant all on public.transactions to service_role;
alter table public.transactions enable row level security;
create policy "txn read" on public.transactions for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- Beneficiaries
create table public.beneficiaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  bank_name text not null,
  account_number text not null,
  nickname text default '',
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.beneficiaries to authenticated;
grant all on public.beneficiaries to service_role;
alter table public.beneficiaries enable row level security;
create policy "ben all" on public.beneficiaries for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Cards
create table public.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  account_id uuid references public.accounts(id) on delete cascade,
  label text not null,
  brand text not null default 'CMFB Visa',
  last4 text not null,
  exp_month int not null,
  exp_year int not null,
  card_type text not null default 'debit',
  frozen boolean not null default false,
  monthly_limit numeric(14,2) not null default 5000,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.cards to authenticated;
grant all on public.cards to service_role;
alter table public.cards enable row level security;
create policy "cards read" on public.cards for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "cards update" on public.cards for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Notifications
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  body text not null default '',
  kind text not null default 'info',
  read boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, update on public.notifications to authenticated;
grant all on public.notifications to service_role;
alter table public.notifications enable row level security;
create policy "notif read" on public.notifications for select to authenticated
  using (user_id = auth.uid());
create policy "notif update" on public.notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Audit log
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  action text not null,
  detail text not null default '',
  severity text not null default 'info',
  created_at timestamptz not null default now()
);
grant select on public.audit_logs to authenticated;
grant all on public.audit_logs to service_role;
alter table public.audit_logs enable row level security;
create policy "audit read" on public.audit_logs for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- Provisioning: idempotent demo data for the signed-in user
create or replace function public.provision_demo()
returns void language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  uemail text;
  chk uuid;
  sav uuid;
  bal numeric := 18452.37;
  i int;
  seed record;
begin
  if uid is null then raise exception 'Not authenticated'; end if;
  if exists (select 1 from public.profiles where id = uid) then return; end if;

  select email into uemail from auth.users where id = uid;

  insert into public.profiles (id, email, full_name, status)
  values (uid, coalesce(uemail,''), split_part(coalesce(uemail,'member'),'@',1), 'RESTRICTED');

  insert into public.user_roles (user_id, role) values (uid, 'customer') on conflict do nothing;

  insert into public.accounts (user_id, name, kind, account_number, balance)
  values (uid, 'Everyday Checking', 'checking', '4021' || lpad((floor(random()*100000000))::text, 8, '0'), bal)
  returning id into chk;
  insert into public.accounts (user_id, name, kind, account_number, balance)
  values (uid, 'High-Yield Savings', 'savings', '7710' || lpad((floor(random()*100000000))::text, 8, '0'), 42310.00)
  returning id into sav;

  insert into public.cards (user_id, account_id, label, last4, exp_month, exp_year, card_type)
  values (uid, chk, 'Everyday Debit', lpad((floor(random()*10000))::text,4,'0'), 8, 2029, 'debit'),
         (uid, chk, 'CMFB Signature Credit', lpad((floor(random()*10000))::text,4,'0'), 3, 2030, 'credit');

  insert into public.beneficiaries (user_id, name, bank_name, account_number, nickname) values
    (uid, 'Maya Ellison', 'Northgate Federal', '000123456789', 'Rent'),
    (uid, 'Leon Okafor', 'Pacific Union Bank', '000987654321', 'Brother'),
    (uid, 'Harper Studio LLC', 'CMFB', '402100045511', 'Contractor');

  i := 0;
  for seed in
    select * from (values
      ('debit','Blue Bottle Coffee','Dining',7.85),
      ('debit','Whole Foods Market','Groceries',146.22),
      ('credit','Payroll — Northwind Systems','Income',4210.00),
      ('debit','Con Edison','Utilities',132.40),
      ('debit','Delta Air Lines','Travel',389.10),
      ('debit','Apple Services','Subscriptions',22.99),
      ('credit','Transfer from Savings','Transfer',500.00),
      ('debit','Equinox Membership','Health',215.00),
      ('debit','Uber','Transport',31.60),
      ('credit','Zelle from Maya Ellison','Transfer',180.00),
      ('debit','Amazon.com','Shopping',94.13),
      ('debit','Verizon Wireless','Utilities',88.00)
    ) as t(dir, descr, cat, amt)
  loop
    i := i + 1;
    insert into public.transactions (user_id, account_id, direction, amount, description, category, balance_after, reference, created_at)
    values (uid, chk, seed.dir::public.txn_direction, seed.amt, seed.descr, seed.cat, bal, 'CMFB' || upper(substr(md5(random()::text),1,10)), now() - (i || ' days')::interval);
  end loop;

  insert into public.notifications (user_id, title, body, kind) values
    (uid, 'Welcome to Confidential Micro Finance Bank', 'Your demo profile is ready. Account verification is pending review.', 'info'),
    (uid, 'Account under review', 'Outgoing transfers are disabled until your account status is set to ACTIVE.', 'warning'),
    (uid, 'New sign-in detected', 'A new device signed in to your online banking profile.', 'info');

  insert into public.audit_logs (user_id, action, detail) values (uid, 'ACCOUNT_PROVISIONED', 'Demo banking profile created');
end; $$;
revoke all on function public.provision_demo() from public;
grant execute on function public.provision_demo() to authenticated;

-- Transfer: all rules enforced server-side
create or replace function public.make_transfer(_from_account uuid, _to_name text, _to_account text, _amount numeric, _memo text)
returns json language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  st public.account_status;
  acct public.accounts%rowtype;
  newbal numeric;
  ref text := 'CMFB' || upper(substr(md5(random()::text),1,10));
begin
  if uid is null then raise exception 'Not authenticated'; end if;
  select status into st from public.profiles where id = uid;

  if _amount is null or _amount <= 0 then
    raise exception 'Enter an amount greater than zero';
  end if;

  if st is distinct from 'ACTIVE' then
    insert into public.audit_logs (user_id, action, detail, severity)
    values (uid, 'TRANSFER_BLOCKED', format('Blocked %s transfer of %s to %s (status %s)', 'outgoing', _amount, _to_name, coalesce(st::text,'UNKNOWN')), 'warning');
    insert into public.notifications (user_id, title, body, kind)
    values (uid, 'Transfer blocked', format('Your transfer of $%s to %s was blocked because your account status is %s.', _amount, _to_name, coalesce(st::text,'UNKNOWN')), 'warning');
    raise exception 'ACCOUNT_NOT_ACTIVE';
  end if;

  select * into acct from public.accounts where id = _from_account and user_id = uid;
  if not found then raise exception 'Account not found'; end if;
  if acct.balance < _amount then raise exception 'INSUFFICIENT_FUNDS'; end if;

  newbal := acct.balance - _amount;
  update public.accounts set balance = newbal where id = acct.id;

  insert into public.transactions (user_id, account_id, direction, amount, description, category, counterparty, balance_after, reference)
  values (uid, acct.id, 'debit', _amount, coalesce(nullif(_memo,''), 'Transfer to ' || _to_name), 'Transfer', _to_name || ' · ' || _to_account, newbal, ref);

  insert into public.audit_logs (user_id, action, detail) values (uid, 'TRANSFER_SENT', format('Sent %s to %s (%s)', _amount, _to_name, ref));
  insert into public.notifications (user_id, title, body, kind)
  values (uid, 'Transfer sent', format('$%s was sent to %s. Reference %s.', _amount, _to_name, ref), 'success');

  return json_build_object('reference', ref, 'balance', newbal);
end; $$;
revoke all on function public.make_transfer(uuid, text, text, numeric, text) from public;
grant execute on function public.make_transfer(uuid, text, text, numeric, text) to authenticated;

-- Admin: change a demo account status
create or replace function public.admin_set_status(_user_id uuid, _status public.account_status)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'Forbidden'; end if;
  update public.profiles set status = _status where id = _user_id;
  insert into public.audit_logs (user_id, action, detail) values (_user_id, 'STATUS_CHANGED', 'Status set to ' || _status::text);
  insert into public.notifications (user_id, title, body, kind)
  values (_user_id, 'Account status updated', 'Your account status is now ' || _status::text || '.', case when _status = 'ACTIVE' then 'success' else 'warning' end);
end; $$;
revoke all on function public.admin_set_status(uuid, public.account_status) from public;
grant execute on function public.admin_set_status(uuid, public.account_status) to authenticated;

-- Self-serve demo admin claim (demo app only)
create or replace function public.claim_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  insert into public.user_roles (user_id, role) values (auth.uid(), 'admin') on conflict do nothing;
  insert into public.audit_logs (user_id, action, detail, severity) values (auth.uid(), 'ADMIN_CLAIMED', 'Demo admin console access granted', 'warning');
end; $$;
revoke all on function public.claim_admin() from public;
grant execute on function public.claim_admin() to authenticated;