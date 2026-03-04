# GitHub Workflows Configuration

## Overview

This repository contains GitHub Actions workflows for synchronizing with the Lovable platform:

1. **sync-file-changes-to-lovable.yml** - Syncs file changes on every push
2. **sync-issues-prs-to-lovable.yml** - Syncs issue and PR events
3. **deploy-health-check.yml** - Performs health checks after deployment

## Lovable Integration (Optional)

The Lovable sync workflows are **optional**. If you don't have a Lovable webhook configured, these workflows will skip gracefully without causing build failures.

### Setting up the Lovable webhook (optional)

If you want to enable Lovable integration:

1. Go to your repository's **Settings** → **Secrets and variables** → **Actions**
2. Add a new secret named `LOVABLE_WEBHOOK_URL`
3. Set the value to your Lovable webhook URL (format: `https://api.lovable.ai/...`)

### Behavior

- **Secret not set**: Workflows log an info message and skip (exit 0)
- **Secret set but invalid URL**: Workflows log a warning and skip (exit 0)
- **Secret set and valid**: Workflows execute the webhook call normally

### Troubleshooting

If you see messages like:
- `ℹ️  LOVABLE_WEBHOOK_URL is not configured - skipping Lovable sync` - This is normal if you don't need Lovable integration
- `⚠️  Warning: LOVABLE_WEBHOOK_URL does not appear to be a valid URL` - Check that your secret starts with `https://` or `http://`

## Recent Changes

**2026-03-03**: Made `LOVABLE_WEBHOOK_URL` optional to prevent build failures when the secret is not configured. Previously, workflows would fail with `exit 1` if the secret was missing. Now they skip gracefully with `exit 0`.
