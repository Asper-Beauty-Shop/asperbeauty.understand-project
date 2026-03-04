# 🚨 WORKFLOW SETUP REQUIRED

## Quick Start: Fix Workflow Failures

If you're seeing workflow failures with messages like:
```
Error: LOVABLE_WEBHOOK_URL is not set
```

### ✅ Solution (2 minutes)

1. **Go to repository Settings**
   ```
   https://github.com/asperpharma/understand-project/settings/secrets/actions
   ```

2. **Click "New repository secret"**

3. **Add the secret:**
   - Name: `LOVABLE_WEBHOOK_URL`
   - Value: Get from [Lovable Project Settings](https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6)

4. **Save and re-run workflows** ✓

### 📚 Complete Instructions

See [docs/GITHUB_SECRETS_SETUP.md](./docs/GITHUB_SECRETS_SETUP.md) for:
- Step-by-step screenshots
- How to get webhook URL from Lovable
- Troubleshooting guide
- Optional Discord notifications setup

---

## About Missing Files

### ❌ HeroSlider.tsx
**Status**: Does not exist and is NOT needed
- The app uses `Hero.tsx` instead
- No references to HeroSlider in the codebase
- This is correct and expected

### ✅ Index.tsx
**Status**: EXISTS at `src/pages/Index.tsx`
- Working correctly
- No action needed

---

## Workflow Status

| Workflow | Requires Secret | Purpose |
|----------|----------------|---------|
| Sync File Changes | `LOVABLE_WEBHOOK_URL` | Syncs code changes to Lovable |
| Sync Issues/PRs | `LOVABLE_WEBHOOK_URL` | Syncs GitHub issues to Lovable |
| Deploy Health Check | None (optional: `DISCORD_WEBHOOK_URL`) | Verifies deployments |

---

**Need help?** See [docs/GITHUB_SECRETS_SETUP.md](./docs/GITHUB_SECRETS_SETUP.md)
