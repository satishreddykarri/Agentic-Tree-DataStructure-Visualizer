"""
Unit tests for authentication service.
"""
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    decode_token,
)


class TestPasswordHashing:
    def test_hash_returns_string(self):
        hashed = hash_password("mysecretpassword")
        assert isinstance(hashed, str)
        assert len(hashed) > 0

    def test_hash_is_not_plaintext(self):
        hashed = hash_password("mysecretpassword")
        assert hashed != "mysecretpassword"

    def test_verify_correct_password(self):
        hashed = hash_password("correctpassword")
        assert verify_password("correctpassword", hashed) is True

    def test_verify_wrong_password(self):
        hashed = hash_password("correctpassword")
        assert verify_password("wrongpassword", hashed) is False

    def test_same_password_different_hashes(self):
        hash1 = hash_password("samepassword")
        hash2 = hash_password("samepassword")
        assert hash1 != hash2
        assert verify_password("samepassword", hash1) is True
        assert verify_password("samepassword", hash2) is True


class TestJWT:
    def test_create_token_returns_string(self):
        token = create_access_token("user-123")
        assert isinstance(token, str)
        assert len(token) > 0

    def test_decode_token_returns_user_id(self):
        user_id = "user-abc-123"
        token = create_access_token(user_id)
        decoded = decode_token(token)
        assert decoded == user_id

    def test_decode_invalid_token(self):
        result = decode_token("this.is.not.a.valid.token")
        assert result is None

    def test_decode_empty_token(self):
        result = decode_token("")
        assert result is None

    def test_different_users_get_different_tokens(self):
        token1 = create_access_token("user-1")
        token2 = create_access_token("user-2")
        assert token1 != token2
        assert decode_token(token1) == "user-1"
        assert decode_token(token2) == "user-2"
