# Lesson 2: Pydantic Best Practices and Advanced Features

> **💻 Practical Example**: See `examples/02_pydantic_best_practices.py` for comprehensive, runnable examples of all advanced features covered in this lesson.

## What You've Learned So Far

From the first lesson (`lessons/01_pydantic_introduction.md`) and example (`examples/01_pydantic_introduction.py`), you now understand:
- ✅ How to create models with `BaseModel`
- ✅ Type annotations and validation
- ✅ Handling validation errors
- ✅ JSON serialization/deserialization
- ✅ Nested models

## Advanced Features

### 1. Field Validation and Constraints

Pydantic provides powerful validation beyond just types:

```python
from pydantic import BaseModel, Field, EmailStr
from typing import Annotated

class User(BaseModel):
    # String with length constraints
    name: Annotated[str, Field(min_length=2, max_length=50)]
    
    # Integer with value constraints
    age: Annotated[int, Field(ge=0, le=120)]  # ge = greater/equal, le = less/equal
    
    # Email validation (requires email-validator package)
    email: EmailStr
    
    # String with pattern matching
    phone: Annotated[str, Field(pattern=r'^\+?1?-?\d{3}-?\d{3}-?\d{4}$')]
```

> **💡 See it in action**: The `UserProfile` class in `examples/02_pydantic_best_practices.py` demonstrates field constraints with detailed comments and error handling.

### 2. Custom Validation Methods

You can add custom validation logic:

```python
from pydantic import BaseModel, field_validator

class User(BaseModel):
    name: str
    age: int
    
    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        """Custom validation for name field."""
        if len(v.strip()) == 0:
            raise ValueError('Name cannot be empty')
        return v.title()  # Convert to Title Case
    
    @field_validator('age')
    @classmethod
    def validate_age(cls, v):
        """Custom validation for age field."""
        if v < 0:
            raise ValueError('Age cannot be negative')
        if v > 150:
            raise ValueError('Age seems unrealistic')
        return v
```

> **💻 Try it yourself**: The `SmartUser` class in the example file shows comprehensive custom validation including password strength, username rules, and data cleaning.

### 3. Model Configuration

Control how your models behave:

```python
from pydantic import BaseModel, ConfigDict

class User(BaseModel):
    model_config = ConfigDict(
        # Don't allow extra fields
        extra='forbid',
        
        # Validate on assignment (not just creation)
        validate_assignment=True,
        
        # Use enum values instead of names
        use_enum_values=True,
        
        # Frozen models (immutable after creation)
        frozen=True
    )
    
    name: str
    age: int
```

> **📚 Deep dive**: See the `ConfiguredUser` class in the example to understand how model configuration affects behavior with practical demonstrations.

## Best Practices for Learning Python

### 1. **Start Simple, Build Complexity**
- Begin with basic models (like our User example)
- Add validation rules gradually
- Understand each concept before moving to the next

### 2. **Use Type Hints Everywhere**
```python
# Good ✅
def create_user(name: str, age: int) -> User:
    return User(name=name, age=age)

# Less clear ❌
def create_user(name, age):
    return User(name=name, age=age)
```

### 3. **Handle Errors Gracefully**
```python
# Good error handling ✅
try:
    user = User(name="Alice", age="invalid")
except ValidationError as e:
    print(f"Validation failed: {e}")
    # Log the error, show user-friendly message, etc.

# Poor error handling ❌
user = User(name="Alice", age="invalid")  # This will crash!
```

### 4. **Use Descriptive Model Names**
```python
# Good ✅
class UserProfile(BaseModel):
    pass

class ProductCatalogItem(BaseModel):
    pass

# Less clear ❌
class Data(BaseModel):
    pass

class Item(BaseModel):
    pass
```

## Common Python Patterns with Pydantic

### 1. **Factory Functions**
```python
def create_default_user() -> User:
    """Factory function to create a user with sensible defaults."""
    return User(
        name="New User",
        age=25,
        email="newuser@example.com"
    )
```

### 2. **Data Transfer Objects (DTOs)**
```python
# Request models (data coming in)
class CreateUserRequest(BaseModel):
    name: str
    age: int
    email: str

# Response models (data going out)
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    # Note: age is private, so not included in response
```

### 3. **Configuration Models**
```python
class DatabaseConfig(BaseModel):
    host: str = "localhost"
    port: int = 5432
    username: str
    password: str
    database: str

# Load from environment variables or config files
config = DatabaseConfig(
    username="myuser",
    password="mypass",
    database="mydb"
)
```

> **🔍 Real-world patterns**: The example file demonstrates API request/response patterns, nested models with `Address` and `Company`, and enum usage with `UserRole`.

## Why This Matters for Learning

### 1. **Modern Python Development**
- Type hints are standard in modern Python
- Many popular frameworks use pydantic (FastAPI, etc.)
- Industry best practice for data validation

### 2. **Error Prevention**
- Catch data problems early
- Clear error messages help debugging
- Reduces runtime errors in production

### 3. **Code Documentation**
- Models serve as living documentation
- Type hints help IDEs provide better assistance
- Self-describing code is easier to maintain

### 4. **Testing and Reliability**
- Easier to write tests with well-defined data structures
- Validation ensures data integrity
- Fewer bugs related to data format issues

## Real-World Applications

### 1. **API Development**
- Validate incoming request data
- Ensure response data format
- Generate API documentation automatically

### 2. **Data Processing**
- Validate data from files, databases, APIs
- Transform data between different formats
- Ensure data quality in pipelines

### 3. **Configuration Management**
- Validate application settings
- Type-safe configuration loading
- Environment-specific configurations

> **💼 See it in practice**: The `demonstrate_real_world_pattern()` function in the example shows how pydantic handles API-like data processing from raw dictionaries to validated objects and back to JSON.

## Hands-On Learning

**📋 To master these advanced concepts:**

1. **Run the examples**: Execute `python examples/02_pydantic_best_practices.py` to see all features in action
2. **Read the code**: Study the detailed comments explaining each validation technique
3. **Experiment**: Modify the models to add your own validation rules
4. **Break things intentionally**: Try invalid data to understand error messages
5. **Build your own**: Create models for real scenarios (products, orders, etc.)

## Next Steps

Now that you understand pydantic fundamentals and advanced features:

1. **Practice**: Create models for real-world scenarios (products, orders, etc.)
2. **Explore**: Try the advanced validation features shown in the example
3. **Integrate**: Use pydantic in larger projects
4. **Learn**: Explore frameworks that use pydantic (like FastAPI)

## Key Programming Principles Demonstrated

- **Type Safety**: Catch errors at definition time, not runtime
- **Explicit Contracts**: Clear data structure definitions
- **Separation of Concerns**: Data models separate from business logic
- **Fail Fast**: Immediate feedback on data problems
- **Documentation**: Self-documenting code through type hints

## Cross-References

- **Previous lesson**: `lessons/01_pydantic_introduction.md` covers the basics
- **Previous example**: `examples/01_pydantic_introduction.py` shows fundamental concepts
- **This example**: `examples/02_pydantic_best_practices.py` demonstrates advanced features

Pydantic represents modern Python best practices: clear, safe, and powerful! 🐍✨ 