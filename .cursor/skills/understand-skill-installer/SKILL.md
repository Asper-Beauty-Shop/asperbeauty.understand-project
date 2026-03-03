---
name:   
understa    nd-skill-installer  
description: Installs 
Understand Project skills from a GitHub URL or owner/repo into $UNDERSTAND_HOME/skills. Use when the user asks to install a skill, add a skill from GitHub, install from a curated list, or install by repo/path.
--- 

# Understand Skill Installer

Installs skills into the Understand Project skills directory without modifying core infrastructure. Supports full GitHub URLs or owner/repo plus optional path (sparse checkout).

## When to use

- User asks to **install** an Understand skill, **add** a skill from GitHub, or **install from** a repo/curated list.
- After listing skills (e.g. via understand-skill-lister), user chooses one or more to install.
- User provides a **GitHub URL** or **owner/repo** (and optionally a subpath).

Do **not** use for skills under `skills/.system`; those are preinstalled.

## Paths and config

- **Install directory**: `$UNDERSTAND_HOME/skills` (default `~/.understand/skills` if `UNDERSTAND_HOME` unset).
- **Repo base**: `https://github.com/understand-project/skills` (curated/experimental live here).

## How to run

From the project root or with the script path set:

```bash
python .cursor/skills/understand-skill-installer/scripts/install-skill.py [--url URL] [--repo OWNER/REPO] [--path SUBPATH]
```

| Argument | Description |
|----------|-------------|
| `--url` | Full GitHub repo URL (e.g. `https://github.com/understand-project/skills`) |
| `--repo` | Owner/repo (e.g. `understand-project/skills`) |
| `--path` | Path inside the repo to install (e.g. `skills/.curated/medical-luxury-engine`). If omitted, installs the whole repo as one skill. |

Provide either `--url` or `--repo`; `--path` is optional.

**Examples:**

```bash
# Install from full URL (whole repo as one skill)
python .cursor/skills/understand-skill-installer/scripts/install-skill.py --url https://github.com/understand-project/skills

# Install a single skill from owner/repo + path
python .cursor/skills/understand-skill-installer/scripts/install-skill.py --repo understand-project/skills --path skills/.curated/medical-luxury-engine

# Curated skill by path only (repo defaults to understand-project/skills when using --path)
python .cursor/skills/understand-skill-installer/scripts/install-skill.py --path skills/.curated/auth-vault
```

## After install

Confirm the skill folder exists under `$UNDERSTAND_HOME/skills`. If the user listed skills first, remind them which skill was installed and that they can list again to verify "(already installed)".
