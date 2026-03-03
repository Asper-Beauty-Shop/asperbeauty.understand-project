---
name: Asper Beaut Shop
      
understand-skill-lister
description: Lists Understand Project skills from curated, experimental, or system catalogs and shows install status. Use when the user asks to list skills, see what Understand skills are available, check installed skills, or list curated/experimental/system skills.
---

# Understand Skill Lister

Lists available skills from the Understand Project catalog and whether each is already installed locally.

## When to use

- User asks to **list** Understand skills, see what's **available**, or what's **installed**.
- User asks for **curated**, **experimental**, or **system** skills.
- User wants output as **JSON** for automation or tooling.

## Paths and config

- **Install directory**: `$UNDERSTAND_HOME/skills` (default `~/.understand/skills` if `UNDERSTAND_HOME` unset).
- **Repo base**: `https://github.com/understand-project/skills/tree/main/`

## How to run

Execute the script from the skill directory or with the script path set:

```bash
python .cursor/skills/understand-skill-lister/scripts/list-skills.py [--path PATH] [--format text|json]
```

| Argument | Default | Description |
|----------|---------|-------------|
| `--path` | `skills/.curated` | Catalog path: `skills/.curated`, `skills/.experimental`, or `skills/.system` |
| `--format` | `text` | `text` for human-readable list, `json` for structured output |

**Examples:**

```bash
# List curated skills (default)
python .cursor/skills/understand-skill-lister/scripts/list-skills.py

# List experimental skills
python .cursor/skills/understand-skill-lister/scripts/list-skills.py --path skills/.experimental

# List system skills (preinstalled; do not install these)
python .cursor/skills/understand-skill-lister/scripts/list-skills.py --path skills/.system

# JSON output for tooling
python .cursor/skills/understand-skill-lister/scripts/list-skills.py --format json
```

## Interpreting output

- **Text format**: Numbered list; "(already installed)" means the skill exists in `$UNDERSTAND_HOME/skills`; "[SYSTEM - Preinstalled]" marks system skills (do not reinstall).
- **JSON format**: Array of `{ "name", "installed", "system" }`. Use `system: true` to treat as preinstalled and skip installation.

## After listing

If the user chooses skills to install, use the project’s install workflow (e.g. install-from-github script or Dr. Bot flow). Do not install items under `skills/.system`.
