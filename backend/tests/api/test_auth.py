"""
API tests for authentication endpoints.
"""


class TestRegister:
    def test_register_success(self, client):
        response = client.post("/auth/register", json={
            "name": "New User",
            "email": "newuser@example.com",
            "password": "password123",
        })
        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_register_duplicate_email(self, client):
        client.post("/auth/register", json={
            "name": "Dup User",
            "email": "dup@example.com",
            "password": "password123",
        })
        response = client.post("/auth/register", json={
            "name": "Dup User 2",
            "email": "dup@example.com",
            "password": "password456",
        })
        assert response.status_code == 400

    def test_register_missing_fields(self, client):
        response = client.post("/auth/register", json={"name": "No Email"})
        assert response.status_code == 422


class TestLogin:
    def test_login_success(self, client):
        client.post("/auth/register", json={
            "name": "Login User",
            "email": "loginuser@example.com",
            "password": "mypassword",
        })
        response = client.post("/auth/login", json={
            "email": "loginuser@example.com",
            "password": "mypassword",
        })
        assert response.status_code == 200
        assert "access_token" in response.json()

    def test_login_wrong_password(self, client):
        client.post("/auth/register", json={
            "name": "WrongPass",
            "email": "wrongpass@example.com",
            "password": "correctpass",
        })
        response = client.post("/auth/login", json={
            "email": "wrongpass@example.com",
            "password": "wrongpass",
        })
        assert response.status_code == 401

    def test_login_nonexistent_user(self, client):
        response = client.post("/auth/login", json={
            "email": "nobody@example.com",
            "password": "password",
        })
        assert response.status_code == 401


class TestProfile:
    def test_get_profile_authenticated(self, client, auth_headers):
        response = client.get("/auth/profile", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert "email" in data

    def test_get_profile_unauthenticated(self, client):
        response = client.get("/auth/profile")
        assert response.status_code == 403
