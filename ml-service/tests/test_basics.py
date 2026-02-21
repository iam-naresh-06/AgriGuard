import pytest
from main import detect_violations

# This is a basic test to ensure the library is installed and we can import the app
def test_import():
    assert callable(detect_violations)

# Add more tests here
