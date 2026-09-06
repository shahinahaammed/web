# Bayah Seafood — Customer + Admin Backend

This version uses **Supabase** for authentication and PostgreSQL, while Vercel hosts the Vite app.

## 1. Install the backend client

```bash
npm install @supabase/supabase-js
```

## 2. Create Supabase project

Create a project at https://supabase.com/.

In **SQL Editor**, run:

1. `supabase/schema.sql`
2. `supabase/seed.sql`

The schema creates:
- `profiles` — customer/admin roles
- `menu_items` — restaurant menu
- `orders` — customer orders
- RLS policies for customer/admin access
- automatic profile creation after Supabase Auth signup

## 3. Enable authentication

For customer login, enable **Phone** authentication in Supabase Auth.

The app uses phone + password for customers. If phone verification is enabled, add an SMS provider and add OTP verification to the UI before production.

For the admin, use **Email + Password** authentication.

## 4. Create the admin

Create an admin user in Supabase Auth with an email and password.

Copy the user's UUID, then run:

```sql
update public.profiles
set role = 'admin'
where id = 'YOUR_AUTH_USER_UUID';
```

Do not put the admin password in the React/Vite source code.

## 5. Environment variables

Create `.env.local`:

```env
SUPABASE_URL=https://drflxfjchqjprutrkpfp.supabase.co
SUPABASE_ANON_KEY=sb_publishable_BR5hsbChi6qFQl0j_LsrlA_A8bLYPGd
```

Use the project's browser-safe publishable/anon key only. **Never put the Supabase service-role key in Vite or the browser.**

## 6. Run locally

```bash
npm install
npm run dev
```

## 7. Deploy to Vercel

Add these same variables in:

**Vercel → Project → Settings → Environment Variables**

- `https://drflxfjchqjprutrkpfp.supabase.co`
- `sb_publishable_BR5hsbChi6qFQl0j_LsrlA_A8bLYPGd`

Then redeploy.

## Login flow

```text
Login
 ├── Customer Login
 │    ├── Create account
 │    └── Phone + password
 │
 └── Admin Login
      └── Email + password
```

Customers can only read their own orders. Admins can read/update all orders, manage the menu, and view customer accounts. Database Row Level Security enforces these permissions; the frontend is not trusted for authorization.
