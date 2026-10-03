# Vercel Deployment Instructions

The project is already linked to Vercel. The following steps are required only the first time:

1. **Install Vercel CLI** (once per machine):
   ```bash
   npm i -g vercel
   ```
2. **Login**:
   ```bash
   vercel login
   ```
   Follow the device‑code URL shown in the terminal.
3. **Link the repository** (if not already linked):
   ```bash
   vercel link
   ```
4. **Deploy**:
   ```bash
   vercel --prod
   ```
   Subsequent pushes to `main` will trigger automatic deployments.

Make sure the following environment variables are set in the Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`
- `SUPABASE_JWKS_URL`
- `DATABASE_URL`
- `DIRECT_URL`

These variables are already defined in `vercel.json` for the build step.
