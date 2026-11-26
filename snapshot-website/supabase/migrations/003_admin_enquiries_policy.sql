-- 003_admin_enquiries_policy.sql
-- Ensures that authenticated admin users can view, update, and delete bookings and customers in the Admin Dashboard

-- Enable bookings access for authenticated users
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'bookings' and policyname = 'Authenticated users can view bookings'
  ) then
    create policy "Authenticated users can view bookings"
      on public.bookings for select
      using (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'bookings' and policyname = 'Authenticated users can update bookings'
  ) then
    create policy "Authenticated users can update bookings"
      on public.bookings for update
      using (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'bookings' and policyname = 'Authenticated users can delete bookings'
  ) then
    create policy "Authenticated users can delete bookings"
      on public.bookings for delete
      using (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'customers' and policyname = 'Authenticated users can view customers'
  ) then
    create policy "Authenticated users can view customers"
      on public.customers for select
      using (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'customers' and policyname = 'Authenticated users can update customers'
  ) then
    create policy "Authenticated users can update customers"
      on public.customers for update
      using (auth.role() = 'authenticated');
  end if;
end $$;
