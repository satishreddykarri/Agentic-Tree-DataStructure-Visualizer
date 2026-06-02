from sqlalchemy.orm import Session
from app.models.chat_history import ChatHistory


def save_message(
    db: Session,
    user_id: str,
    session_id: str,
    role: str,
    message: str,
) -> ChatHistory:
    entry = ChatHistory(
        user_id=user_id,
        session_id=session_id,
        role=role,
        message=message,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def get_history(db: Session, session_id: str) -> list[ChatHistory]:
    return (
        db.query(ChatHistory)
        .filter(ChatHistory.session_id == session_id)
        .order_by(ChatHistory.timestamp.asc())
        .all()
    )


def delete_history(db: Session, session_id: str) -> None:
    db.query(ChatHistory).filter(ChatHistory.session_id == session_id).delete()
    db.commit()
