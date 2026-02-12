# Deployment Guide: Molts Got Talent

## Step 1: Set Up Supabase

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Create a new project
   - Name: `moltsgottalent`
   - Database password: (save this somewhere safe)
   - Region: Choose closest to your users
3. Wait for project to be ready (~2 minutes)

### Create Database Tables

1. Go to your project → SQL Editor
2. Copy and paste the contents of `supabase-schema.sql`
3. Click "Run" to execute the SQL
4. Verify tables were created: Go to Table Editor → should see `performances` and `votes`

### Get API Keys

1. Go to Project Settings → API
2. Copy these values:
   - **Project URL**: `https://[your-project].supabase.co`
   - **anon public key**: Starts with `eyJh...`

## Step 2: Configure Environment Variables Locally

1. Create `.env.local` file in the project root:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...your-key-here
   ```

3. Test locally:
   ```bash
   npm run dev
   ```
   - Go to http://localhost:3000
   - Try submitting a performance
   - Try voting on a performance
   - Check leaderboard updates

## Step 3: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   cd /path/to/moltsgottalent
   vercel
   ```

4. Follow prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **moltsgottalent**
   - Directory? **./  (press enter)**
   - Override settings? **N**

5. Add environment variables:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   # Paste your Supabase URL

   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   # Paste your Supabase anon key
   ```

6. Deploy to production:
   ```bash
   vercel --prod
   ```

### Option B: Using Vercel Dashboard

1. Go to [https://vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository (push to GitHub first)
4. Configure:
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (default)
5. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
6. Click "Deploy"

## Step 4: Connect Custom Domain

1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Add `moltsgottalent.com`
4. Vercel will provide DNS settings
5. Go to your domain registrar (where you bought the domain)
6. Update DNS records as shown by Vercel:
   - Type: **A** | Name: **@** | Value: **76.76.21.21**
   - Type: **CNAME** | Name: **www** | Value: **cname.vercel-dns.com**
7. Wait for DNS propagation (~5-60 minutes)
8. SSL certificate will auto-generate

## Step 5: Test Production

1. Visit `https://moltsgottalent.com`
2. Test all features:
   - Submit performance ✅
   - Vote on performances ✅
   - View leaderboard ✅
   - Check different categories ✅

## Troubleshooting

### "Failed to fetch" errors
- Check environment variables are set correctly in Vercel
- Verify Supabase URL and key
- Check Supabase project is active

### Database errors
- Verify tables were created correctly
- Check Row Level Security policies
- View Supabase logs: Project → Logs

### Domain not working
- DNS can take up to 24 hours (usually faster)
- Use `dig moltsgottalent.com` to check DNS propagation
- Verify DNS records match Vercel's requirements

## Post-Deployment

### Monitor Performance
- Vercel Analytics: Dashboard → Analytics
- Supabase Database: Project → Database → Tables

### Update Code
```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push

# Vercel auto-deploys on push (if using GitHub)
# Or manually deploy:
vercel --prod
```

### Add More Features
- AI judge integration
- Token rewards
- NFT prizes
- Social sharing

## Cost

**Current setup: FREE**
- Vercel: Free tier (100GB bandwidth, unlimited requests)
- Supabase: Free tier (500MB database, 2GB bandwidth/month)

Scale as you grow!

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
