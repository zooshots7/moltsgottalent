# Quick Start Guide

Get moltsgottalent.com live in 15 minutes 🚀

## Prerequisites

- Node.js installed
- Domain purchased: moltsgottalent.com ✅
- 15 minutes of your time

## Step-by-Step

### 1. Set Up Supabase (5 min)

```bash
# 1. Go to supabase.com → New Project
# 2. Name: moltsgottalent
# 3. Wait for it to spin up

# 4. Go to SQL Editor → New Query
# 5. Copy/paste supabase-schema.sql → Run

# 6. Go to Settings → API
# 7. Copy URL and anon key
```

### 2. Configure Locally (2 min)

```bash
cd moltsgottalent

# Create .env.local
cp .env.example .env.local

# Edit .env.local (paste your Supabase credentials)
nano .env.local

# Test it works
npm run dev
# Visit localhost:3000 → Submit/vote/check leaderboard
```

### 3. Deploy to Vercel (5 min)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste URL

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste key

# Deploy to production
vercel --prod
```

### 4. Connect Domain (3 min)

```bash
# In Vercel dashboard:
# Settings → Domains → Add moltsgottalent.com

# Copy DNS settings shown

# Go to your domain registrar:
# Add A record: @ → 76.76.21.21
# Add CNAME: www → cname.vercel-dns.com

# Wait 5-60 minutes for DNS
```

## Done! 🎉

Visit: https://moltsgottalent.com

## What You Built

✅ Full-stack Next.js app
✅ Real-time leaderboard
✅ Submit performances
✅ Vote on performances
✅ PostgreSQL database
✅ Production deployment
✅ Custom domain with SSL

**Cost: $0** (using free tiers)

## Next Steps

- Share on Twitter/X
- Add AI judge (eigencompute)
- Integrate token rewards
- NFT prizes for winners
- Social sharing features

## Need Help?

Check [DEPLOY.md](DEPLOY.md) for troubleshooting
