# Next Steps: Deployment Flow

This document outlines the deployment flow and next steps for the Asper Beauty Shop project.

## Overview

The project uses Lovable for automated deployments with GitHub Actions for health checks and file synchronization.

## Deployment Flow

1. **Code Changes**
   - Make changes to the codebase
   - Commit changes to a feature branch
   - Push to GitHub

2. **Pull Request & Review**
   - Create a pull request to `main` branch
   - Code review and approval
   - Merge to `main`

3. **Automated Deployment**
   - Lovable automatically deploys from `main` branch
   - Deployment typically completes within 2-5 minutes
   - Live site: https://asperbeautyshop-com.lovable.app/

4. **Health Check**
   - GitHub Actions workflow runs automatically after push to `main`
   - Waits 120 seconds for Lovable deployment
   - Checks `/health` endpoint for 200 response
   - Optional: Discord notification with status

## Health Check Endpoint

The application should implement a `/health` endpoint that returns:
- HTTP 200 status for successful health check
- JSON response with status information (optional)

Example implementation (in React Router):
```typescript
{
  path: '/health',
  element: <HealthCheck />
}
```

## Next Steps for Developers

### 0. Configure Required Secrets (FIRST STEP)
⚠️ **Before any workflows can run, you must set up GitHub Secrets:**
- Go to repository **Settings → Secrets and variables → Actions**
- Add `LOVABLE_WEBHOOK_URL` secret (required)
- Optional: Add `DISCORD_WEBHOOK_URL` for deployment notifications

📖 **Complete instructions**: [docs/GITHUB_SECRETS_SETUP.md](./docs/GITHUB_SECRETS_SETUP.md)

**Without this setup, the following workflows will fail:**
- File change synchronization to Lovable
- Issue and PR synchronization to Lovable

### 1. Verify Health Endpoint
- Ensure `/health` route is implemented
- Test locally: `http://localhost:5173/health`
- Verify returns 200 status

### 2. Configure Lovable Webhook Sync
- Go to GitHub repository → Settings → Secrets and variables → Actions
- Add `LOVABLE_WEBHOOK_URL` secret
- To get the URL: open your Lovable project settings at https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6, navigate to **Settings → Integrations** (or **Settings → GitHub**), and copy the webhook URL
- If you can't find it in the UI, contact Lovable support with project ID: `657fb572-13a5-4a3e-bac9-184d39fdf7e6`

### 3. Configure Discord Notifications (Optional)
- Go to GitHub repository → Settings → Secrets and variables → Actions
- Add `DISCORD_WEBHOOK_URL` secret
- Get webhook URL from Discord server settings

### 4. Monitor Deployments
- Check GitHub Actions tab for workflow runs
- Review deployment logs
- Verify health check results

### 5. Troubleshooting

**Workflows fail with "LOVABLE_WEBHOOK_URL is not set":**
- Follow the setup guide: [docs/GITHUB_SECRETS_SETUP.md](./docs/GITHUB_SECRETS_SETUP.md)
- Verify the secret is added in repository Settings → Secrets and variables → Actions
- Ensure the secret name is exactly `LOVABLE_WEBHOOK_URL`

**Health check fails:**
- Verify `/health` endpoint exists and returns 200
- Check Lovable deployment logs
- Ensure deployment completed before health check runs
- Adjust wait time in workflow if needed (currently 120s)

**Deployment doesn't trigger:**
- Verify changes were merged to `main` branch
- Check GitHub Actions is enabled for repository
- Review workflow file permissions
- `.github/workflows/deploy-health-check.yml` - Post-deployment

## Additional Resources

- [Lovable Documentation](https://docs.lovable.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [DEPLOYMENT_TEMPLATE.md](./docs/DEPLOYMENT_TEMPLATE.md) - Detailed deployment guide
- [APPLY_TO_MAIN_SITE.md](./APPLY_TO_MAIN_SITE.md) - Pre-deployment checklist

## Workflow Files
 health verification
- `.github/workflows/sync-file-changes-to-lovable.yml` - File change synchronization
- `.github/workflows/sync-issues-prs-to-lovable.yml` - Issue and PR synchronization

## Contact & Support

For deployment issues or questions:
1. Check workflow logs in GitHub Actions
2. Review Lovable dashboard
3. Consult team documentation in `/docs`
4. Reference [MAIN_PROJECT.md](./MAIN_PROJECT.md) for integration details
