# Welcome to your Lovable project

**Backend (official 2026):** Supabase project `qqceibvalkoytafynwoc` — see [SUPABASE_MASTER_PROFILE.md](./SUPABASE_MASTER_PROFILE.md). Branch: `understand-project`.

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

**Claude Code and Codex Assist (VS Code extension)**  
When using VS Code or Cursor, the *Claude Code and Codex Assist* extension lets you browse chat history from both Claude Code (`~/.claude/projects/`) and Codex (`~/.codex/sessions/`), with visual badges and a unified interface. Useful for reviewing past sessions and applying changes across both assistants (cross-platform: macOS, Windows, Linux).

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Dr. Bot (AI Assistant) — Apply across the platform

**Dr. Bot** (dual-persona: Dr. Sami / Ms. Zain) is the single AI assistant for the site:

- **Where it appears**: One floating chat button on **every page** (home, shop, product, account, etc.). It is mounted once in `App.tsx`, so it is available platform-wide.
- **How users open it**:
  - Click the floating button (bottom-right, or bottom-left in Arabic/RTL).
  - Click **"Consult"** or **"Ask Pharmacist"** in the Header or Footer — these open the same Dr. Bot panel.
- **Backend**: Chat streams from the `beauty-assistant` Supabase Edge Function (same backend for all platforms).

To **apply updates** (including Dr. Bot changes) to the live website, use the steps in *How can I deploy this project?* below.

## How can I deploy this project?

1. **Push your code** to the `main` branch (e.g. from your IDE or GitHub). If the repo is connected to Lovable, changes sync automatically.
2. **Publish from Lovable**: Open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click **Share → Publish** to update the live app.
3. **Custom domain** (e.g. www.asperbeautyshop.com): In Lovable go to **Project → Settings → Domains** and connect your domain. After publishing, the updated site (including Dr. Bot) will be live on that domain.
4. **Backend (optional)**: If you changed `supabase/functions/beauty-assistant`, deploy Edge Functions with the Supabase CLI: `supabase functions deploy beauty-assistant --project-ref qqceibvalkoytafynwoc`.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

