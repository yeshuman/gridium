"""
Pydantic Introduction Example

📚 This example corresponds to lessons/01_pydantic_introduction.md
Read the lesson first for theory, then run this example to see the concepts in action.

This example demonstrates key pydantic concepts:
- Creating models with BaseModel
- Type validation
- Data conversion
- Error handling
- Working with JSON
"""

from pydantic import BaseModel, ValidationError
from typing import Optional
import json

# 1. DEFINING A PYDANTIC MODEL
# =============================

class User(BaseModel):
    """
    A User model that demonstrates basic pydantic functionality.
    
    BaseModel provides:
    - Automatic validation of field types
    - Data conversion when possible
    - JSON serialization/deserialization
    - Clear error messages
    """
    
    # Required fields with type annotations
    name: str              # Must be a string
    age: int              # Must be an integer
    email: str            # Must be a string
    
    # Optional field (can be None)
    nickname: Optional[str] = None  # Default value is None
    
    # Field with a default value
    is_active: bool = True  # Default is True if not provided


# 2. CREATING VALID USERS
# ========================

def create_valid_users():
    """Demonstrates creating valid user objects."""
    
    print("=== Creating Valid Users ===")
    
    # Creating a user with all required fields
    user1 = User(
        name="Alice Smith",
        age=28,
        email="alice@example.com"
    )
    print(f"User 1: {user1}")
    print(f"User 1 name: {user1.name}")  # Accessing individual fields
    print(f"User 1 is_active: {user1.is_active}")  # Default value used
    print()
    
    # Creating a user with optional fields
    user2 = User(
        name="Bob Johnson",
        age=35,
        email="bob@example.com",
        nickname="Bobby",
        is_active=False
    )
    print(f"User 2: {user2}")
    print()
    
    # Pydantic automatically converts compatible types
    # String "25" gets converted to integer 25
    user3 = User(
        name="Charlie Brown",
        age="25",  # ← This string will be converted to int 25
        email="charlie@example.com"
    )
    print(f"User 3: {user3}")
    print(f"User 3 age type: {type(user3.age)}")  # Shows it's now an int
    print()


# 3. HANDLING VALIDATION ERRORS
# ==============================

def demonstrate_validation_errors():
    """Shows what happens when validation fails."""
    
    print("=== Validation Error Examples ===")
    
    # Example 1: Wrong type for age
    try:
        invalid_user = User(
            name="David Wilson",
            age="not-a-number",  # ← This can't be converted to int
            email="david@example.com"
        )
    except ValidationError as e:
        print("❌ Error: Age must be a number")
        print(f"Details: {e}")
        print()
    
    # Example 2: Missing required field
    try:
        invalid_user = User(
            name="Eve Adams",
            # age is missing! ← Required field not provided
            email="eve@example.com"
        )
    except ValidationError as e:
        print("❌ Error: Missing required field")
        print(f"Details: {e}")
        print()


# 4. WORKING WITH JSON DATA
# ==========================

def json_examples():
    """Demonstrates JSON serialization and parsing."""
    
    print("=== JSON Examples ===")
    
    # Create a user object
    user = User(
        name="Frank Miller",
        age=42,
        email="frank@example.com",
        nickname="Frankie"
    )
    
    # Convert user object to JSON string
    user_json = user.model_dump_json()  # Pydantic method to create JSON
    print(f"User as JSON: {user_json}")
    print()
    
    # Convert user object to Python dictionary
    user_dict = user.model_dump()  # Pydantic method to create dict
    print(f"User as dict: {user_dict}")
    print()
    
    # Create user from JSON string
    json_data = '{"name": "Grace Hopper", "age": 85, "email": "grace@example.com"}'
    user_from_json = User.model_validate_json(json_data)  # Parse JSON into User
    print(f"User from JSON: {user_from_json}")
    print()
    
    # Create user from Python dictionary
    dict_data = {
        "name": "Henry Ford",
        "age": 47,
        "email": "henry@example.com",
        "is_active": False
    }
    user_from_dict = User.model_validate(dict_data)  # Create from dict
    print(f"User from dict: {user_from_dict}")
    print()


# 5. ADVANCED FEATURES PREVIEW
# ============================

class Address(BaseModel):
    """A nested model to show composition."""
    street: str
    city: str
    country: str = "USA"  # Default value


class AdvancedUser(BaseModel):
    """User with nested address model."""
    name: str
    age: int
    email: str
    address: Address  # Nested pydantic model


def advanced_example():
    """Shows nested models and composition."""
    
    print("=== Advanced Features ===")
    
    # Creating a user with a nested address
    advanced_user = AdvancedUser(
        name="Ivy Chen",
        age=29,
        email="ivy@example.com",
        address=Address(
            street="123 Main St",
            city="San Francisco"
            # country will default to "USA"
        )
    )
    
    print(f"Advanced user: {advanced_user}")
    print(f"User's city: {advanced_user.address.city}")
    print()


# 6. MAIN EXECUTION
# =================

def main():
    """
    Main function that runs all examples.
    
    📚 For detailed explanations of concepts, see: lessons/01_pydantic_introduction.md
    
    This demonstrates:
    - How to organize code with functions
    - How to handle exceptions gracefully
    - How to structure a Python script
    """
    
    print("🐍 Pydantic Introduction Example")
    print("📚 Corresponds to lessons/01_pydantic_introduction.md")
    print("💡 Read the lesson for detailed explanations of each concept\n")
    
    # Run each example function
    create_valid_users()
    demonstrate_validation_errors()
    json_examples()
    advanced_example()
    
    print("✅ All examples completed!")
    print("\nKey takeaways:")
    print("- Pydantic validates data automatically")
    print("- Type hints make code clear and safe")
    print("- JSON conversion is built-in")
    print("- Error messages are helpful and specific")
    
    print("\n📖 Next steps:")
    print("- Read lessons/02_pydantic_best_practices.md for advanced features")
    print("- Run examples/02_pydantic_best_practices.py for advanced examples")
    print("- Try creating your own models with the patterns you've learned")


# This is a Python idiom - only run main() if this file is executed directly
# (not when imported as a module)
if __name__ == "__main__":
    main() 