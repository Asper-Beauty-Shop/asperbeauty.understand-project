# Unblocking git push on Windows

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
