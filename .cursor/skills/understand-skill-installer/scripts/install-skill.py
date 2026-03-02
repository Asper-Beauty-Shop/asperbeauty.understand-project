"""
Understand Skill Installer — installs skills into $UNDERSTAND_HOME/skills.
Uses Git sparse checkout when --path is given to avoid cloning the full repo.
"""
import os
import subprocess
import argparse
import sys
import shutil
from pathlib import Path

UNDERSTAND_HOME = os.getenv("UNDERSTAND_HOME", str(Path.home() / ".understand"))
SKILLS_DIR = Path(UNDERSTAND_HOME) / "skills"


def normalize_repo_url(url_or_repo: str) -> str:
    """Return a full GitHub clone URL from --url or owner/repo."""
    s = (url_or_repo or "").strip()
    if not s:
        return ""
    if s.startswith("https://") or s.startswith("git@"):
        return s.rstrip("/")
    if "/" in s:
        return f"https://github.com/{s}.git"
    return ""


def get_skill_name_from_path(path: str) -> str:
    """e.g. skills/.curated/medical-luxury-engine -> medical-luxury-engine"""
    path = path.strip("/").replace("\\", "/")
    return path.split("/")[-1] if path else ""


def install_skill(repo_url=None, skill_path=None):
    SKILLS_DIR.mkdir(parents=True, exist_ok=True)
    url = normalize_repo_url(repo_url)
    if not url:
        print("❌ No repo specified. Use --url <github-url> or --repo owner/repo")
        sys.exit(1)

    if skill_path:
        skill_name = get_skill_name_from_path(skill_path)
        if not skill_name:
            print("❌ Invalid --path; could not derive skill name")
            sys.exit(1)
        target_dir = SKILLS_DIR / skill_name
    else:
        # Whole repo: use repo name as folder
        skill_name = url.rstrip("/").rstrip(".git").split("/")[-1]
        target_dir = SKILLS_DIR / skill_name

    if target_dir.exists():
        print(f"⏭️  {skill_name} already exists at {target_dir}. Skipping to avoid overwrite.")
        return

    print(f"📦 Dr. Bot is reaching out to {url}...")

    try:
        if skill_path:
            # Sparse checkout: clone then restrict to path
            clone_dir = SKILLS_DIR / f".clone_{skill_name}"
            clone_dir.mkdir(parents=True, exist_ok=True)
            try:
                subprocess.run(
                    ["git", "clone", "--filter=blob:none", "--sparse", url, str(clone_dir)],
                    check=True,
                    capture_output=True,
                    text=True,
                )
                subprocess.run(
                    ["git", "sparse-checkout", "set", skill_path],
                    cwd=clone_dir,
                    check=True,
                    capture_output=True,
                    text=True,
                )
                # Move the path content to target_dir
                path_in_clone = clone_dir / skill_path.replace("/", os.sep)
                if not path_in_clone.exists():
                    print(f"❌ Path not found in repo: {skill_path}")
                    sys.exit(1)
                try:
                    path_in_clone.rename(target_dir)
                except OSError:
                    shutil.copytree(path_in_clone, target_dir)
                    shutil.rmtree(path_in_clone, ignore_errors=True)
            finally:
                if clone_dir.exists():
                    shutil.rmtree(clone_dir, ignore_errors=True)
        else:
            subprocess.run(
                ["git", "clone", "--depth", "1", url, str(target_dir)],
                check=True,
                capture_output=True,
                text=True,
            )
        print(f"🚀 Integration complete: {skill_name} at {target_dir}")
    except subprocess.CalledProcessError as e:
        print(f"❌ Install failed: {e.stderr or e}")
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Understand Project Skill Installer")
    parser.add_argument("--url", help="Full GitHub repo URL")
    parser.add_argument("--repo", help="Owner/Repo format (e.g. understand-project/skills)")
    parser.add_argument("--path", help="Path inside repo (e.g. skills/.curated/medical-luxury-engine)")

    args = parser.parse_args()
    repo = args.url or args.repo
    if args.path and not repo:
        repo = "understand-project/skills"
    install_skill(repo_url=repo, skill_path=args.path)
