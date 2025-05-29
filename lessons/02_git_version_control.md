# Lesson 2: Git Version Control - Your Code's Time Machine

## What is Git?

Git is a **distributed version control system** that tracks changes in your code over time. Think of it as a sophisticated "save game" system for your programming projects that lets you:

- Save snapshots of your work (commits)
- Go back to any previous version
- Work on different features simultaneously (branches)
- Collaborate with others without conflicts
- See exactly what changed and when

## Why Use Version Control?

### Without Git:
```
my_project/
├── app.py
├── app_backup.py
├── app_working.py
├── app_final.py
├── app_final_final.py
└── app_actually_final.py  😅
```

### With Git:
```
my_project/
├── app.py  (with complete history)
└── .git/   (tracks all changes)
```

## Core Git Concepts

### 1. Repository (Repo)
A **repository** is your project folder with Git tracking enabled.
- Contains all your files AND the complete history
- Created with `git init` or cloned from elsewhere

### 2. Commit
A **commit** is a snapshot of your project at a specific point in time.
- Like taking a photo of your code
- Has a unique ID (hash) and descriptive message
- Cannot be changed once created (immutable)

### 3. Working Directory vs Staging Area vs Repository
```
Working Directory  →  Staging Area  →  Repository
   (your files)        (git add)       (git commit)
```

- **Working Directory**: Where you edit files
- **Staging Area**: Where you prepare changes for commit
- **Repository**: Where commits are permanently stored

## What We Just Did (Real Example)

Let's break down the Git workflow we used when committing our UV lesson:

### 1. Check Status
```bash
git status
# Output: Untracked files: lessons/01_python_environment_setup.md
```
**What this means**: Git sees new files but isn't tracking them yet.

### 2. Stage Changes
```bash
git add lessons/01_python_environment_setup.md examples/01_basic_package_installation.py
```
**What this does**: Moves files from "working directory" to "staging area"

### 3. Commit Changes
```bash
git commit -m "feat: Set up UV environment and create Python learning materials..."
```
**What this creates**: A permanent snapshot with ID `d95c610`

## Essential Git Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `git init` | Start tracking a project | `git init my_project` |
| `git status` | See what's changed | `git status` |
| `git add <file>` | Stage specific file | `git add app.py` |
| `git add .` | Stage all changes | `git add .` |
| `git commit -m "message"` | Save a snapshot | `git commit -m "fix: bug in calculator"` |
| `git log` | See commit history | `git log --oneline` |
| `git diff` | See what changed | `git diff app.py` |
| `git restore <file>` | Undo changes | `git restore app.py` |

## Commit Message Best Practices

### Good Commit Messages:
```bash
git commit -m "feat: add user authentication system"
git commit -m "fix: resolve division by zero error"
git commit -m "docs: update installation instructions"
git commit -m "refactor: simplify data processing logic"
```

### Bad Commit Messages:
```bash
git commit -m "stuff"
git commit -m "fixed it"
git commit -m "changes"
git commit -m "asdfghjkl"
```

### Conventional Commit Format:
```
type: description

Types:
- feat: new feature
- fix: bug fix
- docs: documentation
- refactor: code improvement
- test: adding tests
- style: formatting changes
```

## The Git Workflow (Daily Routine)

```bash
# 1. Check what's changed
git status

# 2. Stage your changes
git add file1.py file2.py
# or stage everything:
git add .

# 3. Commit with descriptive message
git commit -m "feat: implement user login functionality"

# 4. Check your work
git log --oneline -5
```

## Understanding Git History

When you run `git log`, you see:
```
d95c610 feat: Set up UV environment and create Python learning materials
667ee72 docs: Fix changelog repository links
b87e1ba docs: Add comprehensive changelog
```

Each line shows:
- **Hash** (d95c610): Unique identifier for this commit
- **Message**: What was changed
- **Implicit**: When, who, what files

## Branches: Working on Different Features

```bash
# Create a new branch for a feature
git branch feature-calculator
git checkout feature-calculator
# or in one command:
git checkout -b feature-calculator

# Work on your feature, make commits
git add calculator.py
git commit -m "feat: add basic calculator functions"

# Switch back to main branch
git checkout main

# Merge your feature when ready
git merge feature-calculator
```

## Common Scenarios and Solutions

### "I made a mistake in my last commit message"
```bash
git commit --amend -m "correct message"
```

### "I want to undo my last commit but keep the changes"
```bash
git reset --soft HEAD~1
```

### "I want to see what I changed before committing"
```bash
git diff --staged
```

### "I want to ignore certain files"
Create a `.gitignore` file:
```
# Python
__pycache__/
*.pyc
.env

# Virtual environment
.venv/
venv/

# IDE
.vscode/
.idea/
```

## Git Best Practices

### ✅ DO:
- Commit often (small, logical changes)
- Write clear commit messages
- Use branches for new features
- Check `git status` frequently
- Review changes with `git diff` before committing

### ❌ DON'T:
- Commit huge changes all at once
- Write vague commit messages
- Work directly on the main branch for features
- Commit sensitive information (passwords, API keys)
- Force push to shared branches

## Remote Repositories (GitHub, GitLab)

```bash
# Connect to a remote repository
git remote add origin https://github.com/username/repo.git

# Push your commits to the remote
git push origin main

# Get updates from the remote
git pull origin main

# Clone someone else's repository
git clone https://github.com/username/repo.git
```

## Why Git is Essential for Programming

1. **Backup**: Your code is never lost
2. **History**: See how your project evolved
3. **Collaboration**: Multiple people can work on the same project
4. **Experimentation**: Try new features without fear
5. **Accountability**: Track who changed what and when

## Next Steps

Now that you understand Git basics:
1. Practice the daily workflow with small commits
2. Experiment with branches for new features
3. Try the examples in `examples/02_git_workflow.py`
4. Set up a GitHub account for remote repositories

Remember: Git is like a safety net for your code. The more you use it, the more confident you'll become in your programming! 