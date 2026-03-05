    # Unblocking git push on Windows    
> **Push allowed. No blockers detected.**

If you encounter any new push issues (e.g., path or case conflicts) on the Asper Beauty Shop main site, cross-check [APPLY_TO_MAIN_SITE.md](./APPLY_TO_MAIN_SITE.md) for resolution steps specific to this repo.

For ongoing compliance:
- Always verify branch status and staging before main pushes.
- Review Lovable CI logs and run a full internal smoke test after resolving blockers.
- For urgent help, ping the Engineering/DevOps team and reference the ["Unblocking git push" SOP].

> _Asper Beauty Shop: Clinical-luxury, conversion-focused e-commerce ops. All releases must comply with medical-luxury protocols and operational checklists._


Your local `main` has commits that cannot be pushed because the **remote** has a path that is invalid on Windows:

```
.github/instructions/*.instructions.md
```

Windows does not allow `*` in file paths, so `git pull` (merge or rebase) fails and push is rejected.

## Fix on the remote (one-time)

1. On **GitHub**: open the repo → go to `.github/instructions/`.
2. **Rename or remove** the file that uses a literal `*` in its name (e.g. `*.instructions.md` → `default.instructions.md` or similar).
3. Commit that change on the default branch (e.g. from GitHub web or from a Mac/Linux clone).
4. On **this machine**: run `git pull origin main` then `git push origin main`.

After the invalid path is gone, pull and push will work from Windows.
