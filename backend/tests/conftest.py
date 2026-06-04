"""
Shared pytest configuration and fixtures.
"""
import os

# Set test environment variables before importing app modules
os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")
os.environ.setdefault("SECRET_KEY", "test-secret-key-for-testing-only")
os.environ.setdefault("GROQ_API_KEY", "test-key")
os.environ.setdefault("GEMINI_API_KEY", "test-key")
