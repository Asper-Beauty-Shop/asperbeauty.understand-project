# GitHub Secrets Setup Guide

This guide explains how to configure the optional GitHub repository secrets for the Asper Beauty Shop project.

## Overview

The project uses GitHub Actions workflows that support certain secrets to be configured. These secrets enable:
- File change synchronization with Lovable
- Issue and PR synchronization with Lovable
- Optional Discord deployment notifications

## Optional Secrets

### 1. LOVABLE_WEBHOOK_URL (Optional)

This secret is **optional**. If not set, the Lovable integration workflows skip gracefully without causing build failures.

**Purpose**: Enables automatic synchronization of file changes, issues, and pull requests with the Lovable platform.

**Workflows that use this secret**:
- `.github/workflows/sync-file-changes-to-lovable.yml`
- `.github/workflows/sync-issues-prs-to-lovable.yml`

#### How to Set Up

1. **Get the Webhook URL from Lovable**
   - Log into [Lovable](https://lovable.dev)
   - Navigate to your project: https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6
   - Go to project settings or integrations
   - Copy the webhook URL (format: `https://api.lovable.ai/webhooks/...`)

2. **Add the Secret to GitHub**
   - Go to your repository: https://github.com/asperpharma/understand-project
   - Click **Settings** (repository settings, not personal settings)
   - In the left sidebar, click **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `LOVABLE_WEBHOOK_URL`
   - Value: Paste the webhook URL from Lovable
   - Click **Add secret**

#### Verification

After setting the secret:
1. Make a small change to any file
2. Commit and push to any branch
3. Check **Actions** tab in GitHub
4. The "Sync File Changes to Lovable" workflow should run successfully
5. If you see "LOVABLE_WEBHOOK_URL is not set", verify the secret was added with the exact name `LOVABLE_WEBHOOK_URL`

### 2. DISCORD_WEBHOOK_URL (Optional)

This secret is **optional** and enables Discord notifications for deployments.

**Purpose**: Sends deployment status notifications to a Discord channel.

**Workflow that uses this secret**:
- `.github/workflows/deploy-health-check.yml`

#### How to Set Up

1. **Create a Discord Webhook**
   - Open Discord and go to the server where you want notifications
   - Go to **Server Settings** → **Integrations** → **Webhooks**
   - Click **New Webhook**
   - Name it (e.g., "Asper Deploy Notifications")
   - Choose the channel for notifications
   - Click **Copy Webhook URL**

2. **Add the Secret to GitHub**
   - Follow the same steps as above for LOVABLE_WEBHOOK_URL
   - Name: `DISCORD_WEBHOOK_URL`
   - Value: Paste the Discord webhook URL
   - Click **Add secret**

#### What You'll See

When configured, you'll receive Discord messages like:
```
Deploy health: OK | Commit `a6d760d` | https://asperbeautyshop-com.lovable.app
```

## Workflow Behavior Without Secrets

### If LOVABLE_WEBHOOK_URL is NOT set:
- The sync workflows will **skip gracefully** with an informational message:
  ```
  Warning: LOVABLE_WEBHOOK_URL is not set
  Please set the LOVABLE_WEBHOOK_URL secret in the repository settings to enable sync.
  Skipping Lovable sync (secret not configured).
  ```
- The workflow exits with success (`exit 0`) — no build failure occurs
- This is intentional: Lovable sync is optional and CI should not break without it

### If DISCORD_WEBHOOK_URL is NOT set:
- The deploy health check workflow will **still run** successfully
- Discord notifications simply won't be sent (the notification step is skipped)
- This is optional and doesn't affect deployments

## Troubleshooting

### "LOVABLE_WEBHOOK_URL is not set" Warning

**Scenario**: The workflow logs this warning but still succeeds (exits 0).

**What it means**: The `LOVABLE_WEBHOOK_URL` secret is not configured. Lovable sync is skipped for this run.

**If you want to enable Lovable sync**:
1. Verify you added the secret in the correct location (Repository Settings → Secrets and variables → Actions)
2. Check the secret name is exactly `LOVABLE_WEBHOOK_URL` (case-sensitive)
3. Verify the URL format starts with `https://`
4. Re-run the workflow after adding the secret

### "LOVABLE_WEBHOOK_URL does not appear to be a valid URL" Warning

**Scenario**: The workflow logs this warning but still succeeds (exits 0). Lovable sync is skipped.

**If you want to fix this**:
1. Ensure the URL starts with `https://` or `http://`
2. Check there are no extra spaces before or after the URL
3. Verify you copied the complete URL from Lovable
4. Contact Lovable support if you're unsure about the correct webhook URL

### Webhook Call Fails After URL Is Configured

**If the workflow runs but the `curl` call to Lovable fails**:

1. **Check the Actions tab**: View the full error log
2. **Verify secret visibility**: Secrets should show as "Updated X time ago" in Settings → Secrets
3. **Test with a simple push**: Make a trivial change and push to trigger the workflow
4. **Check Lovable status**: Ensure Lovable's webhook endpoint is operational
5. **Review workflow logs**: The masked URL should show as `https://api.lovable.ai/...`

## Security Notes

- **Never commit secrets to the repository**: Always use GitHub Secrets
- **Secrets are masked in logs**: GitHub automatically redacts secret values from workflow logs
- **Access control**: Only repository admins can view/edit secrets
- **Webhook URLs**: Treat these as sensitive credentials - they provide write access to your Lovable project

## Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [DEPLOYMENT_TEMPLATE.md](./DEPLOYMENT_TEMPLATE.md) - Complete deployment guide
- [NEXT_STEPS.md](../NEXT_STEPS.md) - Deployment workflow overview
- [Lovable Documentation](https://docs.lovable.dev/)

## Summary Checklist

Before running workflows, ensure:
- [ ] (Optional) LOVABLE_WEBHOOK_URL is set in GitHub repository secrets to enable Lovable sync
- [ ] If set, secret value starts with https:// and is complete
- [ ] (Optional) DISCORD_WEBHOOK_URL is set for notifications
- [ ] Test by pushing a small change and checking Actions tab
- [ ] Workflow runs successfully — with or without secrets configured
