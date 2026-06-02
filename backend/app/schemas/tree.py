from pydantic import BaseModel
from datetime import datetime
from typing import Any


class SessionCreateRequest(BaseModel):
    name: str = "Untitled Session"


class SessionUpdateRequest(BaseModel):
    name: str | None = None
    tree_json: dict[str, Any] | None = None


class SessionResponse(BaseModel):
    id: str
    user_id: str
    name: str
    tree_json: dict[str, Any]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
