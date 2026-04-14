# Copilot & Cursor Rules — Update Guide

This document explains where Cursor rules live, how to create or update them,
and how to keep GitHub Copilot settings in sync.

---

## Where Cursor rules live

All project-specific Cursor rules are stored under **`.cursor/rules/`**.  
Each rule is a `.mdc` file (Markdown + metadata front-matter):

```
.cursor/
└── rules/
    ├── Compliance-Legal-Rules.mdc
    ├── Monitoring-Quality-Rules.mdc
    ├── Operational-Workflow-Rules.mdc
    └── Strategic-Vision-Rules.mdc
```

Global (user-level) rules live in `~/.cursor/rules/` or are managed via
**Cursor → Settings → Rules for AI**.

---

## Creating or updating rules

Use the built-in **`create-rule`** skill (if available) for scaffolding:

```bash
# Example: scaffold a new rule called "Security-Rules"
cursor skill create-rule Security-Rules
```

To edit an existing rule manually, open the `.mdc` file and update the
front-matter (title, description, `alwaysApply`, `globs`) and the rule body.

---

## Keeping Copilot in sync

When you update a Cursor rule that also affects GitHub Copilot behaviour,
mirror the change in Copilot's instruction settings:

| Setting | Location |
|---|---|
| Review selection instructions | `github.copilot.chat.reviewSelection.instructions` in VS Code / Cursor user settings |
| Commit message instructions | `github.copilot.chat.commitMessageGeneration.instructions` |
| Generate test instructions | `github.copilot.chat.generateTests.instructions` |

The reference file for all custom Copilot/Cursor JSON overrides is
**`cursor-user-settings-FIXED.json`** in the repository root (if present).  
Apply it with the `install-cursor` skill or by copying the relevant keys into
your editor's user `settings.json`.

---

## Workflow

1. **Edit rule** — open the relevant `.cursor/rules/*.mdc` file and update.
2. **Sync Copilot** — if the rule change affects code review or generation
   instructions, update the corresponding Copilot setting (see table above).
3. **Install settings** — run `install-cursor` skill or apply
   `cursor-user-settings-FIXED.json` if prompted.
4. **Commit & push** — rules are committed to the repo so the team shares
   the same AI behaviour.

---

## References

- [CURSOR-SETTINGS-FIX](../cursor-user-settings-FIXED.json) *(if present)*
- [.cursorrules](../.cursorrules) — legacy root-level rules file
- [Cursor documentation — Rules for AI](https://cursor.sh/docs/rules-for-ai)
- [GitHub Copilot custom instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)
