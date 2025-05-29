# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Python Environment Setup with UV**
  - Verified UV installation (v0.4.29) and virtual environment setup
  - `lessons/01_python_environment_setup.md` comprehensive guide covering:
    - UV vs pip comparison and advantages
    - Virtual environment concepts and best practices
    - Step-by-step environment setup walkthrough
    - Key commands reference table
    - DO's and DON'Ts for package management
  - `examples/01_basic_package_installation.py` practical demonstration:
    - Virtual environment detection
    - Package installation workflow template
    - Educational comments explaining each step

- **Git Version Control Education**
  - `lessons/02_git_version_control.md` comprehensive Git tutorial covering:
    - Core Git concepts (repository, commits, staging area)
    - Three-area workflow (Working Directory → Staging → Repository)
    - Real-world examples using actual commit history (`d95c610`)
    - Essential commands with practical examples
    - Commit message best practices and conventional format
    - Branching, merging, and remote repository concepts
    - Common scenarios and troubleshooting solutions
  - `examples/02_git_workflow.py` interactive Git demonstration:
    - Real-time repository status analysis
    - Git command explanations and safe practice exercises
    - Visual representation of Git's three areas
    - Best practices vs anti-patterns examples
    - Interactive tutorial with step-by-step workflow

### Improved
- **Learning Structure Enhancement**
  - Established `lessons/` directory for comprehensive theoretical education
  - Established `examples/` directory for hands-on practical exercises
  - Cross-referenced lessons and examples for integrated learning
  - Added extensive code comments for educational clarity

### Infrastructure
- **Development Environment**
  - UV-based virtual environment (`.venv/`) with Python 3.10.15
  - Modern package management following UV best practices
  - Git repository with proper commit message conventions

## [0.1.0] - 2024-12-19

### Added
- Initial project structure with `lessons/` and `examples/` directories
- Comprehensive Pydantic learning materials following @learning-programming cursor rules
- `01_pydantic_introduction.md` lesson covering basic concepts
- `01_pydantic_introduction.py` example demonstrating:
  - BaseModel creation and usage
  - Type annotations and validation
  - Data conversion and serialization
  - JSON handling
  - Error handling with ValidationError
  - Nested models preview
- `02_pydantic_best_practices.md` lesson covering advanced features
- `02_pydantic_best_practices.py` example demonstrating:
  - Field validation and constraints with `Annotated` and `Field`
  - Custom validation methods using `@field_validator`
  - Model configuration with `ConfigDict`
  - Enums and controlled choices
  - Complex nested data structures
  - Real-world API patterns
- Cross-references between lessons and examples for effective learning
- Professional README.md with:
  - Clear learning objectives
  - Structured learning path
  - Installation instructions
  - Real-world applications
- Project configuration:
  - `pyproject.toml` with modern Python packaging
  - `uv.lock` for deterministic dependencies
  - `.python-version` specifying Python 3.10
  - `.gitignore` with comprehensive Python exclusions
- Pydantic 2.11.5 as core dependency
- Detailed code comments explaining every concept for learning
- Examples that can be run independently to see concepts in action

### Project Structure
```
gridium/
├── lessons/                    # Educational theory and concepts
├── examples/                   # Runnable code demonstrations  
├── pyproject.toml             # Modern Python project configuration
├── uv.lock                    # Dependency lock file
├── .python-version            # Python version specification
├── .gitignore                 # Git exclusions
├── README.md                  # Project documentation
├── CHANGELOG.md               # This changelog
└── hello.py                   # Simple starter file
```

### Technical Details
- Follows Python best practices and PEP standards
- Uses modern type hints and annotations throughout
- Implements proper error handling patterns
- Demonstrates both basic and advanced Pydantic features
- Shows real-world usage patterns for API development
- Educational approach with progressive complexity

### Documentation
- Comprehensive inline code comments
- Cross-referenced lessons and examples
- Clear learning progression from basics to advanced topics
- Hands-on exercises and experimentation guidance
- Best practices explanations with rationale

[Unreleased]: https://github.com/yeshuman/gridium/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yeshuman/gridium/releases/tag/v0.1.0 