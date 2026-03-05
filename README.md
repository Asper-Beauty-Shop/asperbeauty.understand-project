# Asper Beauty Shop

**Update:** 2026-03-04-lzdy

## Download

To download or clone this project locally:

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm i
```

Then run `npm run dev` to start the development server. See [Available scripts](#available-scripts) for more commands.

## Project info

- **Site:** https://www.asperbeautyshop.com
- **Stack:** Vite, TypeScript, React, shadcn-ui, Tailwind CSS
- **Website design:** See [WEBSITE-DESIGN.md](WEBSITE-DESIGN.md) (tokens, components, RTL, Dr. Bot).

## SNC (sync) and applyToAllProfiles

**SNC (sync)** — `npm run sync` (frontend + brain); plus `npm run health` (frontend only), `npm run brain` (edge function only).

**applyToAllProfiles** — In **User** `settings.json` (File → Preferences → Settings → Open Settings JSON), add:

```json
"workbench.settings.applyToAllProfiles": [
  "workbench.editorAssociations",
  "chat.mcp.access",
  "npm.scriptExplorerAction",
  "update.channel"
]
```

**commitDirectlyWarning** — Use a feature branch and PR when branch protection applies; see PUSH-BLOCKER.md if push is blocked.

## Available scripts

**SNC:** `npm run sync` | `npm run health` | `npm run brain` (see [SNC (sync)](#snc-sync-and-applytoallprofiles)).

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run build:dev` | Build in development mode |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run typecheck` | TypeScript check (no emit) |
| `npm run check` | Lint + typecheck |
| `npm run check:all` | Lint + typecheck + build |
| `npm run preview` | Serve production build |
| `npm run test` | Run Vitest once |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:bulk-upload` | Bulk upload validation script |
| `npm run health` | Frontend + brain health check |
| `npm run brain` | Brain (Beauty Assistant) only |
| `npm run sync` | Frontend + brain sync check |
