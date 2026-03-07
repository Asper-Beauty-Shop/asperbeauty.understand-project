# Asper Beauty Shop — Integrations Sync & Auto-Deploy

**Repo:** [asperpharma/understand-project](https://github.com/asperpharma/understand-project)  
**Live site:** https://asperbeautyshop-com.lovable.app/  
**Main project doc:** [MAIN_PROJECT.md](MAIN_PROJECT.md)

This doc describes how to **sync external channels (Notion, Discord, X, etc.)** to this project and how **auto-deploy from `main`** works.

---

## 1. Auto-deploy from `main` branch

### How it works

| Step | What happens |
|------|----------------|
| 1 | You push (or merge a PR) to **`main`** on **asperpharma/understand-project**. |
| 2 | **Lovable** is connected to this repo via [Lovable → Settings → GitHub](https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6/settings?tab=github). |
| 3 | Lovable detects the push and **builds and deploys** the app. |
| 4 | Live site updates at **https://asperbeautyshop-com.lovable.app/** |

### Checklist: ensure auto-deploy is on

- [ ] In Lovable: **Settings → GitHub** — repo **asperpharma/understand-project** is connected.
- [ ] Branch used for deployment is **`main`** (or the branch you set in Lovable).
- [ ] After a push to `main`, a new deployment appears in Lovable and the live site reflects changes within a few minutes.
- [ ] Optional: Run the [post-deploy health check](#optional-github-action-post-deploy-health-check) to verify the site after deploy.

### If deploy doesn’t run

1. Confirm in [Lovable GitHub settings](https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6/settings?tab=github) that the repo and branch are correct.
2. Check Lovable dashboard for failed builds or logs.
3. Ensure **environment variables** in Lovable match those in [MAIN_PROJECT.md](MAIN_PROJECT.md#7-github-lovable--environment-codebase-identity).

### Optional: GitHub Action (post-deploy health check)

A workflow is provided so that after every push to `main`, GitHub Actions can hit your health endpoint to confirm the site is up. Copy the workflow from **`.github/workflows/deploy-health-check.yml`** into your **understand-project** repo (create `.github/workflows/` if needed). See that file for instructions.

### Optional: Sync file changes to Lovable

Workflow **`.github/workflows/files-to-lovable.yml`** runs on every push and POSTs commit info plus lists of **added**, **modified**, and **deleted** files to `LOVABLE_WEBHOOK_URL`. Same secret as below; job skipped if secret is not set.

### Optional: Sync Issues and PRs to Lovable

Workflow **`.github/workflows/sync-issues-prs-to-lovable.yml`** sends GitHub Issues and Pull Request events (opened, edited, reopened, closed) to Lovable via webhook. Lovable can use this to keep project context in sync.

- **Secret required:** In the repo → **Settings → Secrets and variables → Actions**, add **`LOVABLE_WEBHOOK_URL`** with the webhook URL provided by Lovable (if available).
- If the secret is not set, the job is skipped. Payload includes `event_name`, `action`, `repo`, `sender`, `url`, `title`, `body`.

---

## 2. Sync Notion / Discord / X (and others) to this project

All integrations should **point to or feed** the main project: **asperpharma/understand-project** and **https://asperbeautyshop-com.lovable.app/**.

### Notion → this project

| Goal | How to wire it |
|------|----------------|
| **Content for the website** | Use Notion as a CMS: export or API sync into the repo (e.g. copy to `content/` or trigger a build). Keep **understand-project** as the source of the deployed site. |
| **Docs/knowledge for AI (Dr. Sami, Beauty Assistant)** | Export Notion pages (e.g. Markdown/JSON) and ingest into Gorgias Knowledge or Supabase so the same “brain” powers the site and support. |
| **Deploy on Notion edit** | Use Notion’s “Connections” or a small automation (Zapier/Make/n8n) that triggers on page update → call GitHub API to dispatch workflow or trigger Lovable deploy (if Lovable supports webhook). |

**Secrets / config:** Store `NOTION_API_KEY` and `NOTION_DATABASE_ID` in GitHub Secrets (or Lovable env) if you run sync from GitHub Actions. Never commit them.

---

### Discord → this project

| Goal | How to wire it |
|------|----------------|
| **Deploy notifications** | Use Discord webhook: when a deploy finishes, post to a channel (e.g. “Deployed to https://asperbeautyshop-com.lovable.app”). Can be done from GitHub Actions (see workflow example below) or from Lovable if it supports webhooks. |
| **Support/feedback into the main project** | Route Discord messages (e.g. support bot) to the same backend as the site (e.g. Gorgias or Beauty Assistant) so context is one place. |
| **Links in Discord** | All shared links should point to **asperbeautyshop-com.lovable.app** (or custom domain). |

**Secrets:** Add `DISCORD_WEBHOOK_URL` in GitHub Secrets for Actions that post to Discord.

---

### X (Twitter) / social → this project

| Goal | How to wire it |
|------|----------------|
| **Links** | Bios, pins, and posts should link to **https://asperbeautyshop-com.lovable.app/** (or custom domain). |
| **Deep links** | Use same pattern as other channels: e.g. `https://asperbeautyshop-com.lovable.app/?intent=acne&source=twitter`. |
| **Content/campaigns** | Any landing or product URLs should point to this site; keep **understand-project** as the single codebase for that experience. |

---

### Adding another channel “X”

For any new channel (Slack, Telegram, etc.):

1. **Identify direction:** Does it push *to* the project (e.g. content, tickets) or pull *from* it (e.g. links, bot replies)?
2. **Single project:** Ensure the channel uses the **same** URLs, same Shopify store, same Gorgias/support context, and same Beauty Assistant backend as in [MAIN_PROJECT.md](MAIN_PROJECT.md).
3. **Secrets:** Put API keys and webhook URLs in **GitHub Secrets** or **Lovable env**, not in code.
4. **Document:** Add the channel to the “Channels that must connect to this project” table in MAIN_PROJECT.md and, if needed, to RUNBOOK.md.

---

## 3. Quick reference

| What | Where |
|------|--------|
| **Repo** | https://github.com/asperpharma/understand-project |
| **Lovable (GitHub tab)** | https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6/settings?tab=github |
| **Live site** | https://asperbeautyshop-com.lovable.app/ |
| **Frontend health** | https://asperbeautyshop-com.lovable.app/health |
| **Main project / single source of truth** | [MAIN_PROJECT.md](MAIN_PROJECT.md) |

---

*Last updated: Feb 2026. All sync and deploy flows target the main project (understand-project + asperbeautyshop-com.lovable.app).*
