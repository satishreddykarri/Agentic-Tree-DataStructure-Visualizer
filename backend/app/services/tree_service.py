from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.tree_repository import (
    create_session,
    get_session,
    list_sessions,
    update_session,
    delete_session,
)
from app.models.tree_session import TreeSession


def create_tree_session(db: Session, user_id: str, name: str) -> TreeSession:
    return create_session(db, user_id=user_id, name=name)


def get_tree_session(db: Session, session_id: str, user_id: str) -> TreeSession:
    session = get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    if session.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return session


def list_tree_sessions(db: Session, user_id: str) -> list[TreeSession]:
    return list_sessions(db, user_id)


def update_tree_session(
    db: Session,
    session_id: str,
    user_id: str,
    name: str | None = None,
    tree_json: dict | None = None,
) -> TreeSession:
    session = get_tree_session(db, session_id, user_id)
    return update_session(db, session, name=name, tree_json=tree_json)


def delete_tree_session(db: Session, session_id: str, user_id: str) -> None:
    session = get_tree_session(db, session_id, user_id)
    delete_session(db, session)
