# Supabase Setup Guide — EDITORS BRAND

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Name it `editors-brand`, choose your region (Asia South for India)
3. Set a strong database password → **Create Project**

---

## 2. Add Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Find these in: **Supabase Dashboard → Settings → API**

> ⚠️ Use **only** the `anon` / `publishable` key in frontend code.  
> Never put the `service_role` key in `.env`.

---

## 3. Run the SQL Migration

1. In Supabase Dashboard → **SQL Editor** → **New Query**
2. Paste the entire contents of `supabase/migrations/001_initial_schema.sql`
3. Click **Run**

This creates all tables, RLS policies, storage buckets, and seeds pricing data.

---

## 4. Create Your Admin Account

### Step A — Create the auth user
In Supabase Dashboard → **Authentication → Users → Invite user**  
Or via SQL:
```sql
-- Run in SQL Editor
-- (Supabase will email a magic link)
select auth.admin.create_user(
  json_build_object(
    'email', 'your-admin@email.com',
    'password', 'YourStrongPassword123!',
    'email_confirm', true
  )
);
```

### Step B — Add to admin_profiles
After the user exists in auth.users, run:
```sql
insert into public.admin_profiles (id, email, full_name, role)
select
  id,
  email,
  'Your Name',
  'super_admin'
from auth.users
where email = 'your-admin@email.com';
```

---

## 5. Set Up Email Notifications (Optional)

The booking confirmation emails use **Resend** (free: 3,000 emails/month).

### Step A — Get a free Resend API key
1. Go to [resend.com](https://resend.com) → Sign up → **API Keys → Create**

### Step B — Add Supabase Secrets
In Supabase Dashboard → **Edge Functions → Secrets → Add secret**:

| Key | Value |
|-----|-------|
| `RESEND_API_KEY` | `re_xxxxxxxxxxxx` |
| `ADMIN_EMAIL` | `hello@editorsbrand.in` |
| `FROM_EMAIL` | `noreply@yourdomain.com` |

### Step C — Deploy the Edge Function
Install Supabase CLI and run:
```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase functions deploy booking-confirmation
```

> **Note:** Email notifications fail gracefully — if the Edge Function isn't deployed,  
> bookings still save to the database successfully.

---

## 6. Verify Storage Buckets

In Supabase Dashboard → **Storage**:
- `portfolio-images` (public) ✓
- `event-videos` (public) ✓

If they don't appear after migration, create them manually:
1. **Storage → New bucket** → Name: `portfolio-images` → Public ✓
2. **Storage → New bucket** → Name: `event-videos` → Public ✓

---

## 7. Access Your Admin Dashboard

Navigate to: **http://localhost:5173/admin**

Log in with the admin credentials you created in Step 4.

### Dashboard Features:
| Tab | Features |
|-----|----------|
| **Bookings** | View all, search, filter by date, update status, add admin notes |
| **Customers** | View all customer records with search |
| **Pricing** | Edit package names, prices, durations, features |
| **Portfolio** | Upload/delete portfolio images |
| **Videos** | Upload/delete event videos |

---

## 8. Test the Booking Form

1. Go to `http://localhost:5173`
2. Fill in and submit the booking form
3. Check **Supabase → Table Editor → bookings** — your booking should appear
4. Log in to `/admin` and verify it shows in the Bookings tab

---

## File Structure Added

```
src/
  lib/
    supabase.js              ← Supabase client (anon key only)
  context/
    AuthContext.jsx          ← Auth state + isAdmin check
  pages/
    admin/
      AdminLogin.jsx         ← Login page at /admin
      AdminDashboard.jsx     ← Full dashboard at /admin/dashboard
      RequireAdmin.jsx       ← Route guard

supabase/
  migrations/
    001_initial_schema.sql   ← All tables, RLS, buckets, seed data
  functions/
    booking-confirmation/
      index.ts               ← Edge Function for emails

.env.example                 ← Template (commit this)
.env                         ← Your real keys (DO NOT commit)
```

---

## Security Notes

- ✅ Anon key only in frontend — cannot bypass RLS
- ✅ `is_admin()` runs server-side via `security definer` function
- ✅ Customers can INSERT bookings but cannot SELECT other bookings
- ✅ All admin reads/writes require a verified `admin_profiles` row
- ✅ Storage uploads require admin auth
- ✅ `.env` is in `.gitignore` by default (Vite project)
