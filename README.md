# Gridium - Learning Python with Pydantic

A comprehensive learning project demonstrating Python best practices using Pydantic for data validation and type safety.

## 🎯 Learning Objectives

This project teaches modern Python development through:
- **Type Safety**: Using type hints and validation
- **Data Modeling**: Creating robust data structures with Pydantic
- **Error Handling**: Graceful failure and clear error messages
- **Code Organization**: Proper project structure and documentation
- **Best Practices**: Following Python conventions and patterns

## 📚 Project Structure

```
gridium/
├── lessons/                    # Educational materials
│   ├── 01_pydantic_introduction.md
│   └── 02_pydantic_best_practices.md
├── examples/                   # Runnable code examples
│   ├── 01_pydantic_introduction.py
│   └── 02_pydantic_best_practices.py
├── pyproject.toml             # Project configuration
├── uv.lock                    # Dependency lock file
├── .python-version            # Python version specification
└── hello.py                   # Simple starter file
```

## 🚀 Getting Started

### Prerequisites
- Python 3.10 or later
- [uv](https://docs.astral.sh/uv/) package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd gridium
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   uv sync
   ```

## 📖 Learning Path

### 1. Introduction to Pydantic
- **Read**: `lessons/01_pydantic_introduction.md`
- **Practice**: `python examples/01_pydantic_introduction.py`
- **Learn**: Basic models, validation, JSON handling

### 2. Advanced Features & Best Practices  
- **Read**: `lessons/02_pydantic_best_practices.md`
- **Practice**: `python examples/02_pydantic_best_practices.py`
- **Learn**: Custom validation, model configuration, real-world patterns

## 🎓 What You'll Learn

### Core Concepts
- **BaseModel**: Foundation of Pydantic data models
- **Type Annotations**: Modern Python type hinting
- **Validation**: Automatic data validation and conversion
- **Serialization**: JSON and dictionary conversion

### Advanced Topics
- **Field Constraints**: Length limits, numeric ranges, patterns
- **Custom Validators**: Business logic implementation
- **Model Configuration**: Controlling model behavior
- **Nested Models**: Complex data structures
- **Error Handling**: Graceful failure management

### Python Best Practices
- **Explicit is Better Than Implicit**: Clear type definitions
- **Fail Fast**: Early error detection
- **Code Documentation**: Self-documenting through types
- **Tool Support**: IDE assistance and static analysis

## 🛠 Key Dependencies

- **[Pydantic](https://pydantic.dev/)**: Data validation and parsing library
- **[uv](https://docs.astral.sh/uv/)**: Fast Python package manager

## 🎯 Real-World Applications

This project demonstrates patterns used in:
- **API Development**: Request/response validation
- **Data Processing**: ETL pipelines and data quality
- **Configuration Management**: Type-safe settings
- **Database Models**: ORM-like data structures

## 🤝 Contributing

This is a learning project! Feel free to:
- Add new examples demonstrating different concepts
- Improve existing documentation
- Create additional lessons for advanced topics
- Share your learning journey

## 📝 License

This project is for educational purposes. Feel free to use and modify for learning.

## 🙏 Acknowledgments

Built following Python best practices and modern development patterns for effective learning.
