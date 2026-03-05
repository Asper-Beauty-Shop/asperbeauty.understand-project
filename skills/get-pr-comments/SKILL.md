---
name: get-pr-comments
description: Fetch and display comments from the active PR for the current branch. Use when the user asks for PR comments, review feedback, or "get pr comments" / "apply this skill".
---

# Get PR Comments

Fetch and display comments from the **active pull request** for the current branch (Cursor Team Kit style).

---

## Steps

1. **Check `gh` CLI** — Verify the GitHub CLI is available (`gh --version` or `where gh`). If not, tell the user to install [GitHub CLI](https://cli.github.com/).

2. **Check for an open PR** — Run:
   ```bash
   gh pr view --json number,url,title
   ```
   - If no PR exists for this branch, inform the user: *"There is no open PR for this branch."*
   - If a PR exists, continue.

3. **Fetch PR comments and reviews** — Run:
   ```bash
   gh pr view --json comments,reviews
   ```
   Optionally for full thread context:
   ```bash
   gh pr view --json comments,reviews,reviewRequests
   ```

4. **Display in a readable format**:
   - **Review comments**: author, date, body (and path/line if present).
   - **General PR comments**: author, date, body.
   - Group by review thread where applicable.

5. **Summarize** — Briefly summarize reviewer feedback and any **action items** or requested changes.

---

## When to use

- User says "get PR comments", "show PR feedback", "what did reviewers say?", or "apply get-pr-comments".
- Before addressing review feedback or merging.
- When preparing a response to reviewers.

## Requirements

- **GitHub CLI** (`gh`) installed and authenticated (`gh auth status`).
- Current branch must have an open PR.
