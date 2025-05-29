"""
Pydantic Best Practices Example

This example corresponds to lessons/02_pydantic_best_practices.md
and demonstrates advanced pydantic features:

- Field validation and constraints
- Custom validation methods
- Model configuration
- Common Python patterns with pydantic
- Real-world application examples
"""

from pydantic import BaseModel, Field, ValidationError, field_validator, ConfigDict
from typing import Annotated, Optional, List
from enum import Enum
import re

# SECTION 1: FIELD VALIDATION AND CONSTRAINTS
# ============================================

class UserProfile(BaseModel):
    """
    Advanced user model demonstrating field constraints.
    
    This shows how to add validation rules beyond basic types:
    - String length limits
    - Numeric ranges
    - Pattern matching for formats like phone numbers
    """
    
    # String with length constraints
    # Annotated[] allows us to add metadata to types
    name: Annotated[str, Field(
        min_length=2,           # Must be at least 2 characters
        max_length=50,          # Cannot exceed 50 characters
        description="User's full name"
    )]
    
    # Integer with value constraints
    age: Annotated[int, Field(
        ge=0,                   # ge = greater than or equal to 0
        le=120,                 # le = less than or equal to 120
        description="User's age in years"
    )]
    
    # Email with basic format validation (simplified for this example)
    email: Annotated[str, Field(
        pattern=r'^[^@]+@[^@]+\.[^@]+$',  # Basic email pattern
        description="User's email address"
    )]
    
    # Phone number with pattern matching
    phone: Annotated[str, Field(
        pattern=r'^\+?1?-?\d{3}-?\d{3}-?\d{4}$',  # US phone format
        description="Phone number in US format"
    )]
    
    # Score with decimal constraints
    score: Annotated[float, Field(
        ge=0.0,                 # Minimum score
        le=100.0,               # Maximum score
        description="User's performance score"
    )]


# SECTION 2: CUSTOM VALIDATION METHODS
# ====================================

class SmartUser(BaseModel):
    """
    User model with custom validation logic.
    
    Custom validators allow you to implement business rules
    that go beyond simple type and range checking.
    """
    
    name: str
    age: int
    username: str
    password: str
    
    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        """
        Custom validation for the name field.
        
        This validator:
        1. Removes leading/trailing whitespace
        2. Checks for empty names
        3. Converts to Title Case
        4. Validates name contains only letters and spaces
        """
        # Strip whitespace
        v = v.strip()
        
        # Check for empty name
        if len(v) == 0:
            raise ValueError('Name cannot be empty')
        
        # Check for valid characters (letters and spaces only)
        if not re.match(r'^[a-zA-Z\s]+$', v):
            raise ValueError('Name can only contain letters and spaces')
        
        # Return the cleaned, title-cased name
        return v.title()
    
    @field_validator('age')
    @classmethod
    def validate_age(cls, v: int) -> int:
        """
        Custom validation for age with business logic.
        
        This shows how to implement domain-specific rules.
        """
        if v < 0:
            raise ValueError('Age cannot be negative')
        if v > 150:
            raise ValueError('Age seems unrealistic (max 150)')
        if v < 13:
            raise ValueError('User must be at least 13 years old')
        
        return v
    
    @field_validator('username')
    @classmethod
    def validate_username(cls, v: str) -> str:
        """
        Username validation with multiple rules.
        
        Demonstrates combining multiple validation checks.
        """
        v = v.strip().lower()  # Normalize username
        
        # Length check
        if len(v) < 3:
            raise ValueError('Username must be at least 3 characters')
        if len(v) > 20:
            raise ValueError('Username cannot exceed 20 characters')
        
        # Character validation
        if not re.match(r'^[a-z0-9_]+$', v):
            raise ValueError('Username can only contain lowercase letters, numbers, and underscores')
        
        # Cannot start with underscore
        if v.startswith('_'):
            raise ValueError('Username cannot start with underscore')
        
        return v
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        """
        Password strength validation.
        
        This shows how to implement security requirements.
        """
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        
        # Check for required character types
        has_upper = any(c.isupper() for c in v)
        has_lower = any(c.islower() for c in v)
        has_digit = any(c.isdigit() for c in v)
        has_special = any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in v)
        
        if not (has_upper and has_lower and has_digit and has_special):
            raise ValueError('Password must contain uppercase, lowercase, digit, and special character')
        
        return v


# SECTION 3: MODEL CONFIGURATION
# ==============================

class ConfiguredUser(BaseModel):
    """
    User model with custom configuration settings.
    
    model_config allows you to control how the model behaves:
    - How it handles extra fields
    - When validation occurs
    - Whether the model is immutable
    """
    
    # Configuration dictionary controls model behavior
    model_config = ConfigDict(
        # Don't allow fields not defined in the model
        extra='forbid',
        
        # Validate fields when they're assigned (not just at creation)
        validate_assignment=True,
        
        # Make the model immutable after creation
        frozen=True,
        
        # Use string values for enums instead of enum objects
        use_enum_values=True,
        
        # Convert string representations to proper types
        str_strip_whitespace=True,
    )
    
    name: str
    age: int
    email: str


# SECTION 4: ENUMS AND CHOICES
# ============================

class UserRole(str, Enum):
    """
    Enumeration for user roles.
    
    Enums provide a controlled set of valid values
    and make code more maintainable.
    """
    ADMIN = "admin"
    USER = "user"
    MODERATOR = "moderator"
    GUEST = "guest"


class UserWithRole(BaseModel):
    """User model that uses enums for controlled choices."""
    
    name: str
    age: int
    role: UserRole  # Must be one of the enum values
    
    # Optional field with enum and default
    status: UserRole = UserRole.GUEST


# SECTION 5: COMPLEX DATA STRUCTURES
# ==================================

class Address(BaseModel):
    """Nested model for address information."""
    
    street: str
    city: str
    state: Annotated[str, Field(min_length=2, max_length=2)]  # State code
    zip_code: Annotated[str, Field(pattern=r'^\d{5}(-\d{4})?$')]  # ZIP format
    country: str = "USA"  # Default value


class Company(BaseModel):
    """Nested model for company information."""
    
    name: str
    industry: str
    size: Annotated[int, Field(ge=1, description="Number of employees")]


class AdvancedUser(BaseModel):
    """
    Complex user model demonstrating nested models and lists.
    
    This shows how to compose models to represent complex data structures.
    """
    
    # Basic fields
    name: str
    age: int
    email: str
    
    # Nested single object
    address: Address
    
    # Optional nested object
    company: Optional[Company] = None
    
    # List of strings
    skills: List[str] = []
    
    # List of numbers with constraints
    test_scores: Annotated[List[float], Field(description="Test scores (0-100)")] = []
    
    # Complex nested structure
    emergency_contacts: List[dict] = []  # In practice, this would be a list of Contact models


# SECTION 6: DEMONSTRATION FUNCTIONS
# ==================================

def demonstrate_field_constraints():
    """Shows field validation and constraints in action."""
    
    print("=== Field Validation and Constraints ===")
    
    # Valid user
    try:
        user = UserProfile(
            name="Alice Johnson",
            age=28,
            email="alice@example.com",
            phone="555-123-4567",
            score=85.5
        )
        print(f"✅ Valid user: {user.name}, age {user.age}")
    except ValidationError as e:
        print(f"❌ Validation error: {e}")
    
    # Invalid age (too high)
    try:
        user = UserProfile(
            name="Bob",
            age=150,  # Too old!
            email="bob@example.com",
            phone="555-123-4567",
            score=90.0
        )
    except ValidationError as e:
        print(f"❌ Age validation failed: {e.errors()[0]['msg']}")
    
    # Invalid email format
    try:
        user = UserProfile(
            name="Charlie",
            age=25,
            email="not-an-email",  # Invalid format
            phone="555-123-4567",
            score=75.0
        )
    except ValidationError as e:
        print(f"❌ Email validation failed: {e.errors()[0]['msg']}")
    
    print()


def demonstrate_custom_validation():
    """Shows custom validation methods working."""
    
    print("=== Custom Validation Methods ===")
    
    # Valid user with name cleaning
    try:
        user = SmartUser(
            name="  alice smith  ",  # Will be cleaned and title-cased
            age=25,
            username="ALICE_123",    # Will be lowercased
            password="SecurePass123!"
        )
        print(f"✅ Created user: {user.name} (username: {user.username})")
    except ValidationError as e:
        print(f"❌ Validation error: {e}")
    
    # Invalid password
    try:
        user = SmartUser(
            name="Bob Wilson",
            age=30,
            username="bob_w",
            password="weak"  # Too simple
        )
    except ValidationError as e:
        print(f"❌ Password validation: {e.errors()[0]['msg']}")
    
    # Invalid username
    try:
        user = SmartUser(
            name="Charlie Brown",
            age=35,
            username="_invalid",  # Can't start with underscore
            password="StrongPass123!"
        )
    except ValidationError as e:
        print(f"❌ Username validation: {e.errors()[0]['msg']}")
    
    print()


def demonstrate_complex_models():
    """Shows nested models and complex data structures."""
    
    print("=== Complex Models and Nesting ===")
    
    # Create nested models
    address = Address(
        street="123 Main St",
        city="San Francisco",
        state="CA",
        zip_code="94105"
    )
    
    company = Company(
        name="Tech Corp",
        industry="Software",
        size=50
    )
    
    # Create user with nested data
    user = AdvancedUser(
        name="Diana Prince",
        age=32,
        email="diana@example.com",
        address=address,
        company=company,
        skills=["Python", "JavaScript", "SQL"],
        test_scores=[95.5, 87.0, 92.5],
        emergency_contacts=[
            {"name": "John Doe", "phone": "555-0123", "relationship": "spouse"},
            {"name": "Jane Smith", "phone": "555-0456", "relationship": "sister"}
        ]
    )
    
    print(f"✅ Created complex user: {user.name}")
    print(f"   Lives in: {user.address.city}, {user.address.state}")
    print(f"   Works at: {user.company.name} ({user.company.size} employees)")
    print(f"   Skills: {', '.join(user.skills)}")
    print(f"   Average test score: {sum(user.test_scores) / len(user.test_scores):.1f}")
    print()


def demonstrate_configuration():
    """Shows model configuration in action."""
    
    print("=== Model Configuration ===")
    
    # Create a configured user
    user = ConfiguredUser(
        name="  Eve Adams  ",  # Whitespace will be stripped
        age=28,
        email="eve@example.com"
    )
    print(f"✅ Created user with stripped name: '{user.name}'")
    
    # Try to add extra field (will fail due to extra='forbid')
    try:
        user_data = {
            "name": "Frank Miller",
            "age": 35,
            "email": "frank@example.com",
            "nickname": "Frankie"  # This field is not defined in the model
        }
        user = ConfiguredUser(**user_data)
    except ValidationError as e:
        print(f"❌ Extra field rejected: {e.errors()[0]['msg']}")
    
    # Try to modify frozen model (will fail due to frozen=True)
    try:
        user.age = 29  # This will fail because the model is frozen
    except ValidationError as e:
        print(f"❌ Cannot modify frozen model: {e}")
    
    print()


def demonstrate_real_world_pattern():
    """Shows a practical real-world usage pattern."""
    
    print("=== Real-World Pattern: API Request/Response ===")
    
    # Simulating data that might come from an API or form
    user_registration_data = {
        "name": "Grace Hopper",
        "age": 85,
        "email": "grace@navy.mil",
        "address": {
            "street": "1000 Navy Pentagon",
            "city": "Washington",
            "state": "DC",
            "zip_code": "20350"
        },
        "skills": ["Mathematics", "Computer Science", "Leadership"]
    }
    
    try:
        # Parse and validate the incoming data
        user = AdvancedUser(**user_registration_data)
        
        print(f"✅ Successfully registered user: {user.name}")
        
        # Convert back to dict for API response
        response_data = user.model_dump()
        print(f"📤 Response data includes {len(response_data)} fields")
        
        # Convert to JSON for API transmission
        json_data = user.model_dump_json()
        print(f"📡 JSON response length: {len(json_data)} characters")
        
    except ValidationError as e:
        print(f"❌ Registration failed: {e}")
    
    print()


# MAIN EXECUTION
# =============

def main():
    """
    Main function demonstrating all advanced pydantic features.
    
    This corresponds to lessons/02_pydantic_best_practices.md
    and shows real-world applications of pydantic's advanced features.
    """
    
    print("🚀 Advanced Pydantic Features Demo")
    print("📚 See lessons/02_pydantic_best_practices.md for detailed explanations\n")
    
    # Run all demonstrations
    demonstrate_field_constraints()
    demonstrate_custom_validation()
    demonstrate_complex_models()
    demonstrate_configuration()
    demonstrate_real_world_pattern()
    
    print("✅ All advanced examples completed!")
    print("\n🎯 Key takeaways:")
    print("- Field constraints make validation powerful and specific")
    print("- Custom validators implement business logic")
    print("- Model configuration controls behavior")
    print("- Nested models handle complex data structures")
    print("- Pydantic excels at API and data processing tasks")
    
    print("\n📖 Next steps:")
    print("- Read lessons/02_pydantic_best_practices.md for theory")
    print("- Experiment with your own models")
    print("- Try building a small API with these patterns")


# Run the demonstrations
if __name__ == "__main__":
    main() 