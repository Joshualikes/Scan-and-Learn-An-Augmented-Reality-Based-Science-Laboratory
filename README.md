Scan-and-Learn is a React inventory and information system for the Cabcaben Elementary School science laboratory.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually http://localhost:5173).

Register as **Admin** or **Laboratory Staff** to add/edit equipment, generate QR codes, and record borrow/return logs.

## Supabase login

Accounts are stored in Supabase Auth. A `profiles` table keeps each user's full name, username, and role.

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env` and paste **Project URL** and **anon public** key from Project Settings → API.
3. In Authentication → Providers → Email, turn **Confirm email** off so school accounts can sign in immediately.
4. In SQL Editor, run `supabase/schema.sql`.
5. Restart `npm run dev`.
