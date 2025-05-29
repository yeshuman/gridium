"""
Example 1: Basic Package Installation with UV

This example demonstrates how to work with packages in your UV-managed virtual environment.
Before running this script, make sure you've:
1. Activated your virtual environment: source .venv/bin/activate
2. Installed the required package: uv add requests

This script shows how to use an external package (requests) to make HTTP requests.
"""

# Standard library import (always available)
import json
from datetime import datetime

# Third-party import (needs to be installed with 'uv add requests')
# Uncomment the line below after installing requests
# import requests


def demonstrate_package_usage():
    """
    Demonstrates using an external package in our UV environment.
    
    This function shows:
    - How to make HTTP requests with the requests library
    - How to handle JSON responses
    - Basic error handling
    """
    print("🚀 Demonstrating UV Package Management")
    print("=" * 50)
    
    # Check if we're in a virtual environment
    import sys
    if hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("✅ Running in virtual environment")
        print(f"📍 Python path: {sys.prefix}")
    else:
        print("⚠️  Not running in virtual environment")
        print("Run: source .venv/bin/activate")
        return
    
    print(f"🐍 Python version: {sys.version}")
    print(f"📅 Current time: {datetime.now()}")
    
    # Uncomment this section after installing requests with 'uv add requests'
    """
    try:
        # Make a simple HTTP request to a public API
        response = requests.get('https://httpbin.org/json')
        data = response.json()
        
        print("\\n🌐 HTTP Request successful!")
        print(f"Status Code: {response.status_code}")
        print(f"Response data: {json.dumps(data, indent=2)}")
        
    except ImportError:
        print("\\n❌ requests package not found!")
        print("Install it with: uv add requests")
    except Exception as e:
        print(f"\\n❌ Error making request: {e}")
    """
    
    print("\n📝 To complete this example:")
    print("1. Make sure your virtual environment is activated")
    print("2. Run: uv add requests")
    print("3. Uncomment the requests import and usage code above")
    print("4. Run this script again")


if __name__ == "__main__":
    demonstrate_package_usage() 