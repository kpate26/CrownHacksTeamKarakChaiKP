# Volo

Volo is a Vite + vanilla JavaScript volunteer discovery app for finding local events and signing up to help.

## Run locally

```bash
npm install
npm run dev
```

The app ships with curated demo events so it works immediately. To connect a Supabase project, run `supabase/schema.sql` in the SQL editor, seed the `events` table, and copy `.env.example` to `.env.local` with:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Vercel detects the Vite build automatically. Use `npm run build` to create the production bundle.
