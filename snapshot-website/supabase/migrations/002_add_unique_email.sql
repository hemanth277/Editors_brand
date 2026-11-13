-- 002_add_unique_email.sql
-- Add unique constraint on customers.email for upsert conflict handling

alter table public.customers
  add constraint customers_email_unique unique (email);
