# GitHub Actions Setup Guide

This repository includes several GitHub Actions workflows that automate various tasks. Some workflows require repository secrets to be configured.

## Workflows Overview

### 1. Sync File Changes to Lovable
**File:** `.github/workflows/sync-file-changes-to-lovable.yml`

This workflow runs on every push to any branch and sends a list of changed files to Lovable via webhook.

**Status:** Optional - the workflow will skip silently if the secret is not configured.

### 2. Sync Issues and PRs to Lovable
**File:** `.github/workflows/sync-issues-prs-to-lovable.yml`

This workflow runs when issues or pull requests are opened, edited, closed, or reopened, and sends event data to Lovable via webhook.

**Status:** Optional - the workflow will skip silently if the secret is not configured.

### 3. Deploy Health Check
**File:** `.github/workflows/deploy-health-check.yml`

This workflow runs on every push to the main branch, waits for Lovable to deploy, and then checks the frontend health endpoint.

**Status:** Always runs. Discord notifications are optional.

## Required Secrets (Optional)

### LOVABLE_WEBHOOK_URL

**Required by:**
- Sync File Changes to Lovable
- Sync Issues and PRs to Lovable

**Description:** The webhook URL provided by Lovable for syncing repository events.

**How to set up:**

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter:
   - **Name:** `LOVABLE_WEBHOOK_URL`
   - **Value:** Your Lovable webhook URL (e.g., `https://api.lovable.ai/...`)
5. Click **Add secret**

**Note:** If you don't have a Lovable webhook URL, contact your backend or operations team. These workflows are optional and will skip silently if this secret is not configured.

### DISCORD_WEBHOOK_URL (Optional)

**Required by:**
- Deploy Health Check (for notifications only)

**Description:** Discord webhook URL for posting deployment health check results.

**How to set up:**

Follow the same steps as above, but use:
- **Name:** `DISCORD_WEBHOOK_URL`
- **Value:** Your Discord webhook URL (e.g., `https://discord.com/api/webhooks/...`)

## Workflow Behavior Without Secrets

If the `LOVABLE_WEBHOOK_URL` secret is not configured:
- ✅ The workflows will **skip silently** without causing any failures
- ✅ Other workflows and CI checks will continue to run normally
- ℹ️ You'll see these jobs marked as "Skipped" in the GitHub Actions interface

This is intentional - the Lovable sync workflows are optional features that enhance your workflow but are not required for the repository to function.

## Troubleshooting

### Workflow is failing with "LOVABLE_WEBHOOK_URL is not set"

If you're seeing this error, you're likely running an older version of the workflow. Make sure you have the latest version from the repository, which includes the graceful skip behavior.

### How do I know if the workflows are working?

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Look for the workflow runs:
   - If the secret is configured: You'll see successful runs with logs showing the webhook calls
   - If the secret is not configured: You'll see the jobs marked as "Skipped"

### Invalid URL error

If the workflow runs but fails with an "Invalid URL" error, check that your `LOVABLE_WEBHOOK_URL` secret:
- Starts with `https://` or `http://`
- Is a valid, complete URL
- Has no extra spaces or characters

## Support

For issues with:
- **Lovable webhook URL**: Contact your Lovable support team or project administrator
- **GitHub Actions**: Check the [GitHub Actions documentation](https://docs.github.com/en/actions)
- **Repository workflows**: Open an issue in this repository
