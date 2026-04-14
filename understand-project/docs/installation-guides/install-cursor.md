# Install Cursor for Asper Beauty Shop

Guide to installing Cursor IDE and opening the Asper Beauty Shop project so you can develop and deploy using the main-site workflow.

---

## 1. Install Cursor

1. **Download:** [cursor.com](https://cursor.com) → Download for your OS (Windows / macOS / Linux).
2. **Install** the app and sign in if required.
3. **(Windows)** Optional: set PowerShell execution policy so extensions (e.g. Toolkit for Antigravity) can run scripts:

   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
   ```

   See [docs/development.md](../development.md) for Toolkit notes.

---

## 2. Clone and open the project

```sh
git clone https://github.com/asperpharma/understand-project.git
cd understand-project
npm i
```

Open the `understand-project` folder in Cursor: **File → Open Folder** → select the repo folder.

---

## 3. Project environment (`.env`)

Create a `.env` file at the project root with the variables from [BRAIN-CONFIG.md](../BRAIN-CONFIG.md) (Cursor workspace environment).  
Do **not** commit `.env`; it is in `.gitignore`.

---

## 4. Cursor User settings (applyToAllProfiles)

So key settings apply across profiles, add this to **User** `settings.json` (File → Preferences → Settings → **Open Settings JSON**):

```json
"workbench.settings.applyToAllProfiles": [
  "workbench.editorAssociations",
  "chat.mcp.access",
  "npm.scriptExplorerAction",
  "update.channel",
  "stash-push:command"
]
```

If your `settings.json` is corrupted or shows "Unknown Configuration Setting", use the fix guide and copy-paste file in the repo root: [CURSOR-SETTINGS-FIX.md](../../CURSOR-SETTINGS-FIX.md) and [cursor-user-settings-FIXED.json](../../cursor-user-settings-FIXED.json).

---

## 5. Verify and run

From the project root:

```sh
npm run sync
npm run health
```

If both pass, the frontend and Brain (Beauty Assistant) are connected. Run `npm run dev` to start the dev server.

---

## 6. Deploy to main site (APPLY_TO_MAIN_SITE)

Before pushing to production:

- **Run flow:** [APPLY_AND_RUN.md](../APPLY_AND_RUN.md) — sync, health, then push to `main`.
- **Full checklist:** [APPLY_TO_MAIN_SITE.md](../../APPLY_TO_MAIN_SITE.md) — Lovable env, Supabase redirects, SITE_URL, social links, verification.

Use a feature branch and PR when branch protection applies; see [PUSH-BLOCKER.md](../../PUSH-BLOCKER.md) if push is blocked.

---

## Quick reference

| Step               | Doc / action                                                                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Install Cursor     | cursor.com, then optional ExecutionPolicy (see [development.md](../development.md))                                                              |
| Clone & open       | `git clone` → `npm i` → Open Folder in Cursor                                                                                                 |
| Env                | [BRAIN-CONFIG.md](../BRAIN-CONFIG.md) → `.env` at repo root                                                                                   |
| User settings      | applyToAllProfiles in settings.json; if broken → [CURSOR-SETTINGS-FIX.md](../../CURSOR-SETTINGS-FIX.md)                                       |
| Verify             | `npm run sync` then `npm run health`                                                                                                          |
| Deploy to main     | [APPLY_AND_RUN.md](../APPLY_AND_RUN.md) and [APPLY_TO_MAIN_SITE.md](../../APPLY_TO_MAIN_SITE.md)                                                 |
