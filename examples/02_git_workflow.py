"""
Example 2: Git Workflow Demonstration

This example helps you understand Git concepts through interactive demonstrations.
It shows the relationship between working directory, staging area, and repository.

Before running this script, make sure you're in a Git repository and have
your virtual environment activated: source .venv/bin/activate
"""

import subprocess
import os
import sys
from datetime import datetime


def run_git_command(command: str) -> tuple[str, str]:
    """
    Run a git command and return stdout and stderr.
    
    Args:
        command: Git command to run (without 'git' prefix)
    
    Returns:
        Tuple of (stdout, stderr) as strings
    """
    try:
        result = subprocess.run(
            f"git {command}",
            shell=True,
            capture_output=True,
            text=True,
            cwd=os.getcwd()
        )
        return result.stdout.strip(), result.stderr.strip()
    except Exception as e:
        return "", str(e)


def check_git_repo() -> bool:
    """
    Check if we're in a Git repository.
    
    Returns:
        True if in a Git repo, False otherwise
    """
    stdout, stderr = run_git_command("rev-parse --git-dir")
    return stdout != "" and stderr == ""


def demonstrate_git_status():
    """
    Demonstrate how git status shows the state of your working directory.
    
    This function shows:
    - How to check what files have changed
    - The difference between tracked and untracked files
    - How the staging area works
    """
    print("🔍 DEMONSTRATING: git status")
    print("=" * 50)
    
    # Check current git status
    stdout, stderr = run_git_command("status --porcelain")
    
    if not stdout:
        print("✅ Working directory is clean - no changes detected")
    else:
        print("📝 Current file status:")
        lines = stdout.split('\n')
        for line in lines:
            if line.startswith('??'):
                print(f"  🆕 Untracked: {line[3:]}")
            elif line.startswith(' M'):
                print(f"  📝 Modified (unstaged): {line[3:]}")
            elif line.startswith('M '):
                print(f"  ✅ Modified (staged): {line[3:]}")
            elif line.startswith('A '):
                print(f"  ➕ Added (staged): {line[3:]}")
    
    print("\n💡 Understanding the output:")
    print("  - Untracked: Git doesn't know about these files yet")
    print("  - Modified (unstaged): Changed but not added to staging area")
    print("  - Modified (staged): Ready to be committed")


def demonstrate_git_log():
    """
    Demonstrate how to view Git history and understand commits.
    
    This function shows:
    - Recent commit history
    - How to read commit information
    - Different ways to view git log
    """
    print("\n📚 DEMONSTRATING: git log")
    print("=" * 50)
    
    # Get recent commits
    stdout, stderr = run_git_command("log --oneline -5")
    
    if stdout:
        print("🕒 Recent commit history:")
        lines = stdout.split('\n')
        for i, line in enumerate(lines, 1):
            if line.strip():
                hash_part = line[:7]
                message_part = line[8:]
                print(f"  {i}. {hash_part} - {message_part}")
        
        print(f"\n📊 Total commits in this repository:")
        total_stdout, _ = run_git_command("rev-list --count HEAD")
        if total_stdout:
            print(f"  {total_stdout} commits")
    else:
        print("❌ No commit history found")
    
    print("\n💡 Understanding commits:")
    print("  - Each commit has a unique hash (like d95c610)")
    print("  - Commits form a timeline of your project's evolution")
    print("  - You can go back to any commit at any time")


def demonstrate_staging_area():
    """
    Demonstrate the concept of Git's staging area.
    
    This function shows:
    - What the staging area is
    - How files move through Git's three areas
    - The purpose of staging before committing
    """
    print("\n🎭 DEMONSTRATING: Git's Three Areas")
    print("=" * 50)
    
    print("Git has three main areas for your files:")
    print()
    print("1️⃣  WORKING DIRECTORY")
    print("    ↓ (git add)")
    print("2️⃣  STAGING AREA") 
    print("    ↓ (git commit)")
    print("3️⃣  REPOSITORY")
    print()
    
    # Show what's in each area
    print("Current state of your files:")
    
    # Working directory changes
    stdout, stderr = run_git_command("diff --name-only")
    if stdout:
        print(f"  📝 Modified in working directory: {len(stdout.split())} files")
    else:
        print("  ✅ Working directory clean")
    
    # Staging area
    stdout, stderr = run_git_command("diff --cached --name-only")
    if stdout:
        print(f"  🎭 Files in staging area: {len(stdout.split())} files")
    else:
        print("  📭 Staging area empty")
    
    print("\n💡 Why use a staging area?")
    print("  - Review changes before committing")
    print("  - Commit only related changes together")
    print("  - Fix mistakes before they become permanent")


def show_git_best_practices():
    """
    Display Git best practices with examples.
    
    This function demonstrates:
    - Good vs bad commit practices
    - How to write clear commit messages
    - When to commit and when not to
    """
    print("\n⭐ GIT BEST PRACTICES")
    print("=" * 50)
    
    print("✅ GOOD commit messages:")
    good_examples = [
        "feat: add user login functionality",
        "fix: resolve division by zero in calculator",
        "docs: update installation instructions",
        "refactor: simplify data processing logic"
    ]
    
    for example in good_examples:
        print(f"  • {example}")
    
    print("\n❌ BAD commit messages:")
    bad_examples = [
        "stuff",
        "fixed it",
        "changes",
        "work in progress"
    ]
    
    for example in bad_examples:
        print(f"  • {example}")
    
    print("\n📏 Commit size guidelines:")
    print("  ✅ Small, focused changes")
    print("  ✅ One logical change per commit") 
    print("  ❌ Huge changes affecting many files")
    print("  ❌ Multiple unrelated changes together")


def interactive_git_tutorial():
    """
    Provide an interactive tutorial for trying Git commands.
    
    This function guides users through:
    - Safe Git commands to try
    - Step-by-step workflow practice
    - Real-time feedback on their actions
    """
    print("\n🎓 INTERACTIVE GIT TUTORIAL")
    print("=" * 50)
    
    print("Try these safe Git commands in your terminal:")
    print("(Open a new terminal and run these one by one)")
    print()
    
    commands = [
        ("git status", "Check current state of your repository"),
        ("git log --oneline -10", "See last 10 commits in one line each"),
        ("git diff", "See what you've changed (if anything)"),
        ("git branch", "List all branches (you're probably on 'master' or 'main')"),
        ("git remote -v", "See remote repositories (like GitHub)"),
    ]
    
    for i, (command, description) in enumerate(commands, 1):
        print(f"{i}. {command}")
        print(f"   → {description}")
        print()
    
    print("💡 Practice workflow:")
    print("1. Make a small change to this file (add a comment)")
    print("2. Run: git status")
    print("3. Run: git add examples/02_git_workflow.py")
    print("4. Run: git status (notice the difference!)")
    print("5. Run: git commit -m 'practice: add comment to git example'")
    print("6. Run: git log --oneline -3")
    print()
    print("🎉 Congratulations! You've completed a full Git workflow!")


def main():
    """
    Main function that orchestrates the Git workflow demonstration.
    
    This function:
    - Checks if we're in a Git repository
    - Runs all demonstration functions
    - Provides a complete learning experience
    """
    print("🚀 Git Workflow Demonstration")
    print("=" * 60)
    print(f"📅 Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📁 Current directory: {os.getcwd()}")
    
    # Verify we're in a Git repository
    if not check_git_repo():
        print("❌ Error: Not in a Git repository!")
        print("Make sure you're in your project directory with .git folder")
        sys.exit(1)
    
    print("✅ Confirmed: You're in a Git repository")
    
    # Run all demonstrations
    demonstrate_git_status()
    demonstrate_git_log()
    demonstrate_staging_area()
    show_git_best_practices()
    interactive_git_tutorial()
    
    print("\n" + "=" * 60)
    print("🎓 Git Workflow Demonstration Complete!")
    print("\n📖 Key takeaways:")
    print("  • Git tracks your code's history")
    print("  • Use clear, descriptive commit messages")
    print("  • Commit small, logical changes")
    print("  • The staging area helps you prepare commits")
    print("  • Practice makes perfect!")
    
    print(f"\n📚 For more details, see: lessons/02_git_version_control.md")


if __name__ == "__main__":
    main() 