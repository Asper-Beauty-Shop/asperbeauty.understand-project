import os
import json
import argparse
from pathlib import Path

# --- Configuration ---
# Defaults to ~/.understand/skills if $UNDERSTAND_HOME is not set
UNDERSTAND_HOME = os.getenv("UNDERSTAND_HOME", str(Path.home() / ".understand"))
SKILLS_DIR = Path(UNDERSTAND_HOME) / "skills"
REPO_BASE_URL = "https://github.com/understand-project/skills/tree/main/"

def get_installed_skills():
    """Returns a list of folder names in the local skills directory."""
    if not SKILLS_DIR.exists():
        return []
    return [d.name for d in SKILLS_DIR.iterdir() if d.is_dir()]

def list_skills(path_suffix, output_json=False):
    """
    In a real-world scenario, this would fetch from the GitHub API.
    For this implementation, we simulate the 'curated' and 'experimental' lists.
    """
    # Simulated skill lists (In production, replace with GitHub API call)
    catalog = {
        "skills/.curated": ["medical-luxury-engine", "auth-vault", "inventory-sync"],
        "skills/.experimental": ["smart-hall-iot", "dna-visualizer", "predictive-restock"],
        "skills/.system": ["core-orchestrator", "security-kernel"]
    }

    available = catalog.get(path_suffix, [])
    installed = get_installed_skills()

    results = []
    for skill in available:
        results.append({
            "name": skill,
            "installed": skill in installed,
            "system": path_suffix == "skills/.system"
        })

    if output_json:
        print(json.dumps(results, indent=2))
    else:
        print(f"\n--- Skills from {path_suffix} ---")
        if not results:
            print("No skills found or source unavailable.")
        for idx, item in enumerate(results, 1):
            status = "(already installed)" if item["installed"] else ""
            system_tag = "[SYSTEM - Preinstalled]" if item["system"] else ""
            print(f"{idx}. {item['name']} {status} {system_tag}")
        print("\nWhich ones would you like installed?\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Understand Project Skill Lister")
    parser.add_argument("--path", default="skills/.curated", help="Path to fetch skills from")
    parser.add_argument("--format", choices=["text", "json"], default="text", help="Output format")

    args = parser.parse_args()
    list_skills(args.path, output_json=(args.format == "json"))
