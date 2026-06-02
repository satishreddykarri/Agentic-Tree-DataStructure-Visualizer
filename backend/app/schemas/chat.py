from pydantic import BaseModel
from datetime import datetime
from typing import Any


class ChatMessageRequest(BaseModel):
    session_id: str
    message: str
    tree_state: dict[str, Any]


class ChatHistoryItem(BaseModel):
    id: str
    role: str
    content: str
    timestamp: str

    class Config:
        from_attributes = True


class ChatMessageResponse(BaseModel):
    explanation: str
    action: dict[str, Any] | None
    updated_tree: dict[str, Any] | None
