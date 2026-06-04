"""
API test fixtures — sets up an in-memory SQLite database and test client.
"""
import os
import pytest

os.environ["DATABASE_URL"] = "sqlite:///./test_api.db"
os.environ["SECRET_KEY"] = "test-secret-key"
os.environ["GROQ_API_KEY"] = "test-key"
os.environ["GEMINI_API_KEY"] = "test-key"

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base
from app.dependencies import get_db

TEST_DATABASE_URL = "sqlite:///./test_api.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    try:
        if os.path.exists("./test_api.db"):
            os.remove("./test_api.db")
    except Exception:
        pass


@pytest.fixture(scope="session")
def client():
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture(scope="session")
def auth_headers(client):
    """Register a test user and return auth headers."""
    client.post("/auth/register", json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpassword123",
    })
    response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "testpassword123",
    })
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
