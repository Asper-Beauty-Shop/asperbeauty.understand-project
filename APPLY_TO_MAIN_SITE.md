# Apply All Updates, Brain & Everything to Main Website

Main site: https://www.asperbeautyshop.com/ Repo: asperpharma/understand-project Lovable: https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6/settings Supabase project ID (correct): vhgwvfedgfmcixhdyttt — use this for all Brain, Auth, and Edge Functions.

Use this checklist to run all updates and apply the brain, social media, Google Merchant Center, and every page to the main Asper Beauty Shop website.

--------------------------------------------------------------------------------
Perfect update in 4 steps (copy-paste)
Do this whenever you want the latest code live on the main site.

1. Open a terminal in your understand-project folder. If you don't have it yet:
gh repo clone asperpharma/understand-project
cd understand-project

2. Get latest and install deps.
git pull origin main
npm install

3. Deploy to the live site. (If you have no new changes, skip the commit; otherwise:)
git add .
git commit -m "Your message"
git push origin main
Lovable will build and deploy; the site updates in a few minutes at https://www.asperbeautyshop.com/

4. Verify.
# From this VIP folder (Asper Shop ALL Files VIP):
npm run health
Then open https://www.asperbeautyshop.com/ and spot-check: Home, Products, Cart, Beauty Assistant.

--------------------------------------------------------------------------------
?? Manual overrides to clear blockers (100% Production Ready)
Do these in your dashboards so the live site can use the Brain and Commerce Engine. Tick each when done.

Step 1 — Lovable environment variables
Where: Lovable ? asper-beauty-shop ? Settings ? Environment variables
Set (or confirm) these production variables:
Variable | Value to use
VITE_SUPABASE_URL | https://vhgwvfedgfmcixhdyttt.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY | (your anon/public key from Supabase)
VITE_SHOPIFY_STORE_DOMAIN | lovable-project-milns.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN | (your Storefront API token)
VITE_SHOPIFY_API_VERSION | 2025-07
Also set if not already: VITE_SUPABASE_PROJECT_ID = vhgwvfedgfmcixhdyttt, VITE_SITE_URL = https://www.asperbeautyshop.com/, VITE_LOVABLE_URL = www.asperbeautyshop.com.
[ ] All Lovable env vars saved; redeploy or push to main so build uses them

Step 2 — Supabase Auth redirects
Where: Supabase Dashboard ? Authentication ? URL Configuration
Under Redirect URLs, add: https://www.asperbeautyshop.com/**
Set Site URL to: https://www.asperbeautyshop.com/
Save
[ ] Redirect URLs include main site; Site URL points to main site

Step 3 — Edge Function SITE_URL secret (COD emails)
Where: Supabase ? Project Settings ? Edge Functions ? Secrets
Add or update: SITE_URL = https://www.asperbeautyshop.com/
[ ] SITE_URL secret set so COD/confirmation emails link to the live site

Step 5 — Google Merchant Center
Log into Google Merchant Center.
Confirm your Shopify product feed (and new JSON-LD markup) is syncing 5,000+ SKUs without critical errors.
Ensure product and storefront links point to https://www.asperbeautyshop.com (or your custom domain).
[ ] Feed syncing; no critical errors; links point to main site

Step 8 — Deploy and verify
Deploy from the understand-project repo (not this VIP folder):
cd path/to/understand-project
git add .
git commit -m "feat: complete apply_to_main_site checklist with deep links and schema"
git push origin main
Lovable will build and deploy. Then verify (from this VIP folder):
npm run health
Then open https://www.asperbeautyshop.com/ and https://www.asperbeautyshop.com/health — expect 200. Optionally run npm run test:brain for full Brain/Beauty Assistant check.
[ ] Pushed to main from understand-project; Lovable deploy successful
[ ] npm run health passes; /health returns 200; site and Brain connected

--------------------------------------------------------------------------------
How to get and deploy the latest updates (reference)

Goal | What to do
Get latest code | In the understand-project folder: run git pull origin main (or git pull). If you don’t have the repo yet: gh repo clone asperpharma/understand-project then cd understand-project and git pull.
Deploy latest to the live site | Push to main: git add . ? git commit -m "Your message" ? git push origin main. Lovable will build and deploy to https://www.asperbeautyshop.com/ in a few minutes.
Redeploy without code changes | In Lovable ? your project ? Deployments, trigger a new deploy or “Redeploy” the latest.
Update this VIP folder (docs/workflows) | If this folder is a git repo: git pull. If it’s a copy, re-copy from your source or pull the latest from wherever you keep these files.
Install/update dependencies | In understand-project: npm install. In this VIP folder (scripts): npm install if you added or changed scripts.
Verify the site | Run npm run health in this VIP folder, or open https://www.asperbeautyshop.com/ and check home, products, cart, and Beauty Assistant.
Store access & links | Full list of live URL, Lovable project, social (Facebook, Instagram, WhatsApp), and Google Merchant Center: docs/STORE_ACCESS_AND_LINKS_MASTER.md.

One-liner: Pull in understand-project ? push to main ? Lovable deploys ? npm run health and open the site.


