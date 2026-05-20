-- Personal expense tracker: transactions table with RLS

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  amount numeric(12, 2) not null check (amount > 0),
  category text not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_created_idx
  on public.transactions (user_id, created_at desc);

alter table public.transactions enable row level security;

-- SELECT: users read only their rows
create policy "transactions_select_own"
  on public.transactions
  for select
  using (auth.uid() = user_id);

-- INSERT: users create only for themselves
create policy "transactions_insert_own"
  on public.transactions
  for insert
  with check (auth.uid() = user_id);

-- UPDATE: requires SELECT + UPDATE policies (both use auth.uid())
create policy "transactions_update_own"
  on public.transactions
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- DELETE
create policy "transactions_delete_own"
  on public.transactions
  for delete
  using (auth.uid() = user_id);
