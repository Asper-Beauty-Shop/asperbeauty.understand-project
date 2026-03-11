# Repository secrets (GitHub Actions)

Required **Actions** secrets so CI workflows run as intended.

## LOVABLE_WEBHOOK_URL (required for “Notify Lovable”)

The **Build and Push to Lovable** workflow (`build-and-push-to-lovable.yml`) runs a **Notify Lovable** step after each push to `main`. That step only runs when this secret is set; otherwise the deploy job is skipped.

**How to set it**

1. Open the repo on GitHub: **Settings → Secrets and variables → Actions**.
2. Click **New repository secret**.
3. Name: `LOVABLE_WEBHOOK_URL`.
4. Value: the webhook URL from Lovable (file sync / deploy). Get it from your [Lovable project settings](https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6/settings) (or the Integrations / Webhooks section Lovable provides).
5. Add the secret and save.

After this is set, the “Notify Lovable (push file changes for deploy)” step will run on each push to `main`.

---

Other workflows that use the same secret (and also skip when it’s empty):

- `sync-file-changes-to-lovable.yml`
- `sync-issues-prs-to-lovable.yml`
