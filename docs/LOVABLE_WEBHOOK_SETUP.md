# Lovable Webhook Setup Guide

## Overview

This repository includes GitHub Actions workflows that sync code changes, issues, and pull requests to Lovable via webhook. The workflows are designed to work seamlessly whether the `LOVABLE_WEBHOOK_URL` secret is configured or not.

## Workflows Affected

1. **Sync File Changes to Lovable** (`.github/workflows/sync-file-changes-to-lovable.yml`)
   - Triggers on every push to any branch
   - Sends lists of added/modified/removed files to Lovable

2. **Sync Issues and PRs to Lovable** (`.github/workflows/sync-issues-prs-to-lovable.yml`)
   - Triggers on issue and pull request events (opened, edited, closed, reopened)
   - Sends issue/PR metadata to Lovable

## Default Behavior (No Secret Configured)

If the `LOVABLE_WEBHOOK_URL` secret is **not set**, the workflows will:
- Log a warning message
- Skip the Lovable sync gracefully
- Exit with success status (exit 0)
- **Not fail your CI/CD pipeline**

This allows the repository to function normally without requiring the secret.

## Setting Up the Secret (Optional)

To enable Lovable sync functionality:

### Step 1: Obtain the Webhook URL

Get your Lovable webhook URL from:
- Lovable project dashboard
- Lovable project settings
- Or contact Lovable support

The URL should be in the format:
```
https://api.lovable.ai/webhook/...
```

### Step 2: Add the Secret to GitHub

1. Navigate to your repository on GitHub
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Set the name: `LOVABLE_WEBHOOK_URL`
5. Paste the webhook URL as the value
6. Click **"Add secret"**

### Step 3: Verify the Configuration

After adding the secret:

1. Make a commit and push to any branch
2. Check the workflow run in the **Actions** tab
3. The "Sync File Changes to Lovable" job should show:
   ```
   LOVABLE_WEBHOOK_URL=https://api.lovable.ai/...
   Gathering lists of changed files...
   Sending file changes to Lovable...
   ```

## Security Notes

- The webhook URL is masked in GitHub Actions logs
- Only the protocol and domain are visible (e.g., `https://api.lovable.ai/...`)
- The workflows validate the URL format before making requests
- Invalid URLs will be skipped with a warning, not an error

## Troubleshooting

### Workflow fails with "LOVABLE_WEBHOOK_URL is not set"

**Solution**: This was an issue in older versions of the workflows. The latest versions (as of March 2026) handle missing secrets gracefully. If you see this error:
1. Pull the latest changes from the main branch
2. Ensure you have the updated workflow files

### Workflow succeeds but Lovable doesn't receive events

**Possible causes**:
1. The webhook URL is incorrect or expired
2. The Lovable service is down
3. Network issues between GitHub Actions and Lovable

**Debug steps**:
1. Verify the webhook URL is correct
2. Check the workflow logs for the masked URL output
3. Contact Lovable support to verify the webhook is active

### Invalid URL format error

**Solution**: Ensure the webhook URL starts with `http://` or `https://`. The workflow validates this format before sending requests.

## Recent Fixes (March 2026)

### Issue: Shell Injection and Missing Secret Failures

**Problem**: The workflows previously:
1. Failed with exit code 1 when `LOVABLE_WEBHOOK_URL` was not set
2. Had shell injection vulnerabilities when processing PR body text
3. Interpreted PR description content as shell commands

**Solution**: 
1. Changed `exit 1` to `exit 0` for missing/invalid secrets (graceful degradation)
2. Updated the payload construction to read from `$GITHUB_EVENT_PATH` directly via jq
3. Used `--argjson event_data "$(cat "$GITHUB_EVENT_PATH")"` to safely extract title and body

**Benefits**:
- Workflows no longer fail when the secret is not configured
- No shell injection vulnerabilities from PR/issue body content
- Proper JSON handling for all event data

## Related Files

- `.github/workflows/sync-file-changes-to-lovable.yml`
- `.github/workflows/sync-issues-prs-to-lovable.yml`
- `CLAUDE.md` - General AI assistant guide
- `APPLY_TO_MAIN_SITE.md` - Production deployment checklist
