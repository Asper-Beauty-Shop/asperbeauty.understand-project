#!/usr/bin/env python3
"""
Understand Project: install a skill from GitHub (curated list or external URL).
Uses clone then sparse-checkout fallback. Never installs over .system skills.
"""
import os
import re
import shutil
import subprocess
import argparse
from pathlib import Path

UNDERSTAND_HOME = os.getenv("UNDERSTAND_HOME", str(Path.home() / ".understand"))
SKILLS_DIR = Path(UNDERSTAND_HOME) / "skills"
REPO_BASE = "https://github.com/"
SYSTEM_PATHS = ("skills/.system",)

def get_installed_skills():
    if not SKILLS_DIR.exists():
        return []
    return [d.name for d in SKILLS_DIR.iterdir() if d.is_dir()]

def skill_name_from_path(path: str) -> str:
    """e.g. skills/.curated/medical-luxury-engine -> medical-luxury-engine"""
    return path.rstrip("/").split("/")[-1] if path else ""

def install_via_clone(repo: str, path_suffix: str, skill_name: str) -> bool:
    """Clone repo and copy the single skill directory into SKILLS_DIR."""
    repo_url = repo if repo.startswith("http") else f"{REPO_BASE}{repo}.git"
    clone_dir = SKILLS_DIR.parent / "_clone"
    clone_dir.mkdir(parents=True, exist_ok=True)
    target = SKILLS_DIR / skill_name
    try:
        if target.exists():
            print(f"Already present: {target}. Skipping to avoid overwrite.")
            return True
        subprocess.run(
            ["git", "clone", "--depth", "1", "--filter=blob:none", "--sparse", repo_url, str(clone_dir)],
            check=True, capture_output=True, text=True
        )
        subprocess.run(["git", "sparse-checkout", "set", path_suffix], cwd=clone_dir, check=True, capture_output=True, text=True)
        # path_suffix is e.g. skills/.curated/medical-luxury-engine
        src = Path(clone_dir) / path_suffix.replace("/", os.sep)
        if not src.exists():
            src = Path(clone_dir) / "skills" / path_suffix.split("/")[-2] / skill_name
        if not src.exists() and (Path(clone_dir) / "skills").exists():
            for p in (Path(clone_dir) / "skills").rglob(skill_name):
                if p.is_dir():
                    src = p
                    break
        if not src or not src.exists():
            print(f"Path not found in repo: {path_suffix}")
            return False
        SKILLS_DIR.mkdir(parents=True, exist_ok=True)
        shutil.copytree(src, target)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Git error: {e.stderr or e}")
        return False
    except Exception as e:
        print(f"Install error: {e}")
        return False
    finally:
        if clone_dir.exists():
            shutil.rmtree(clone_dir, ignore_errors=True)

def install_from_url(url: str, skill_name: str) -> bool:
    """Install from a GitHub URL (e.g. single-skill repo)."""
    # Accept https://github.com/org/repo or https://github.com/org/repo/tree/branch/path
    match = re.match(r"https?://github\.com/([^/]+)/([^/]+?)(?:\.git)?(?:/tree/[^/]+/(.+))?$", url.strip())
    if not match:
        print("Unrecognized GitHub URL.")
        return False
    org, repo_name, path = match.group(1), match.group(2), match.group(3) or ""
    repo = f"{org}/{repo_name}"
    path_suffix = path if path else repo_name
    name = skill_name or skill_name_from_path(path) or repo_name
    return install_via_clone(repo, path_suffix, name)

def main():
    ap = argparse.ArgumentParser(description="Install Understand Project skill from GitHub")
    ap.add_argument("--repo", default="understand-project/skills", help="Repo: org/repo")
    ap.add_argument("--path", help="Path in repo, e.g. skills/.curated/medical-luxury-engine")
    ap.add_argument("--url", help="Full GitHub URL (for external/private repo)")
    ap.add_argument("--name", help="Skill name when using --url (default from path/repo)")
    args = ap.parse_args()

    if args.url:
        skill_name = args.name or skill_name_from_path(args.url)
        if install_from_url(args.url, skill_name):
            print(f"Installed from URL: {skill_name}")
        else:
            print("Install from URL failed.")
            return 1
        return 0

    if not args.path:
        print("Provide --path (e.g. skills/.curated/medical-luxury-engine) or --url")
        return 1

    for sys_path in SYSTEM_PATHS:
        if sys_path in args.path or args.path.startswith(sys_path + "/"):
            print("Cannot install skills/.system skills.")
            return 1

    skill_name = skill_name_from_path(args.path)
    if skill_name in get_installed_skills():
        print(f"{skill_name} is already installed. Skipping.")
        return 0

    if install_via_clone(args.repo, args.path, skill_name):
        print(f"Installed: {skill_name}")
        return 0
    return 1

if __name__ == "__main__":
    exit(main())
