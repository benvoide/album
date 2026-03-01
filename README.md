# Album

A private photo album app with 3 privacy levels: private, shareable link, and public.

## Stack

- **Next.js 14** (App Router)
- **Supabase** (Auth, PostgreSQL, Storage)
- **Tailwind CSS**
- **Vintage Riviera** color palette

## Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. In **Project Settings > API**, copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Run database migrations

In the Supabase Dashboard, go to **SQL Editor** and run the contents of:

`supabase/migrations/20240301000000_initial_schema.sql`

Or use the Supabase CLI:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

### 4. Create storage bucket

If the migration did not create it, create a bucket named `photos` in **Storage** with **Private** access.

### 5. Configure Auth redirect URLs

In **Authentication > URL Configuration**, add:

- Site URL: `http://localhost:3000` (for dev)
- Redirect URLs: `http://localhost:3000/auth/callback`

### 6. Start the app

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Private albums:** Only you can see them.
- **Shareable link:** Generate a link; anyone with it can view.
- **Public:** Visible to everyone.
- Create albums, upload photos, edit privacy, copy share links.
