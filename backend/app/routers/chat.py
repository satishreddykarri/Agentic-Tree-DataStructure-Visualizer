from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from datetime import timezone

from app.dependencies import get_db, get_current_user
from app.schemas.chat import ChatMessageRequest, ChatMessageResponse, ChatHistoryItem
from app.services.chat_service import process_message, get_chat_history, clear_chat_history
from app.models.user import User

router = APIRouter()


@router.post("/message", response_model=ChatMessageResponse)
def send_message(
    payload: ChatMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = process_message(
        db,
        user_id=current_user.id,
        session_id=payload.session_id,
        message=payload.message,
        tree_state=payload.tree_state,
    )
    return ChatMessageResponse(
        explanation=result["explanation"],
        action=result["action"],
        updated_tree=result["updated_tree"],
    )


@router.get("/history/{session_id}", response_model=list[ChatHistoryItem])
def get_history(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    history = get_chat_history(db, session_id=session_id, user_id=current_user.id)
    return [
        ChatHistoryItem(
            id=item.id,
            role=item.role,
            content=item.message,
            timestamp=item.timestamp.replace(tzinfo=timezone.utc).isoformat(),
        )
        for item in history
    ]


@router.delete("/history/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_history(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    clear_chat_history(db, session_id=session_id, user_id=current_user.id)
