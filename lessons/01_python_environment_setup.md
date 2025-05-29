# Lesson 1: Python Environment Setup with UV

## What is UV?

`uv` is a modern, fast Python package installer and resolver written in Rust. It's designed to be a drop-in replacement for `pip` and `pip-tools`, but with significantly better performance and more reliable dependency resolution.

## Why Use UV Instead of Pip?

1. **Speed**: UV is 10-100x faster than pip for most operations
2. **Better Dependency Resolution**: More reliable at resolving complex dependency conflicts
3. **Modern Design**: Built from the ground up with lessons learned from pip's limitations
4. **Reproducible Builds**: Better lock file generation and environment management

## What We Just Accomplished

### 1. Verified UV Installation
```bash
which uv && uv --version
# Output: /home/rueben/.cargo/bin/uv
# Output: uv 0.4.29
```

This confirmed that `uv` is installed and ready to use.

### 2. Created a Virtual Environment
```bash
uv venv .venv
```

**What is a Virtual Environment?**
- A virtual environment is an isolated Python environment
- It allows you to install packages without affecting your system Python
- Each project should have its own virtual environment
- This prevents package conflicts between different projects

### 3. Activated the Virtual Environment
```bash
source .venv/bin/activate
```

**What Happens When You Activate?**
- Your shell prompt changes to show `(.venv)` 
- Python commands now use the virtual environment's Python
- Package installations go to the virtual environment, not system-wide

## Best Practices We're Following

### ✅ DO:
- Use `uv` for all package management
- Use `uv add package_name` to install packages
- Always work within a virtual environment
- Keep one virtual environment per project

### ❌ DON'T:
- Use `pip` (we use `uv` instead)
- Use `uv pip` (use direct `uv` commands)
- Install packages globally (use virtual environments)
- Mix package managers in the same project

## Key Commands to Remember

| Command | Purpose |
|---------|---------|
| `uv venv .venv` | Create a new virtual environment |
| `source .venv/bin/activate` | Activate the virtual environment |
| `uv add package_name` | Install a package |
| `uv remove package_name` | Remove a package |
| `uv sync` | Sync environment with lock file |
| `deactivate` | Deactivate the virtual environment |

## Next Steps

Now that your environment is set up, you can:
1. Install Python packages using `uv add`
2. Write Python code knowing your environment is isolated
3. Share your project with others using the generated lock files

See the example in `examples/01_basic_package_installation.py` to practice using your new environment! 