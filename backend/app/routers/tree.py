from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.schemas.tree import SessionCreateRequest, SessionUpdateRequest, SessionResponse
from app.services.tree_service import (
    create_tree_session,
    get_tree_session,
    list_tree_sessions,
    update_tree_session,
    delete_tree_session,
)
from app.models.user import User

router = APIRouter()


@router.post("/session", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
def create_session(
    payload: SessionCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_tree_session(db, user_id=current_user.id, name=payload.name)


@router.get("/sessions", response_model=list[SessionResponse])
def get_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_tree_sessions(db, user_id=current_user.id)


@router.get("/session/{session_id}", response_model=SessionResponse)
def get_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_tree_session(db, session_id=session_id, user_id=current_user.id)


@router.put("/session/{session_id}", response_model=SessionResponse)
def update_session(
    session_id: str,
    payload: SessionUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_tree_session(
        db,
        session_id=session_id,
        user_id=current_user.id,
        name=payload.name,
        tree_json=payload.tree_json,
    )


@router.delete("/session/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    delete_tree_session(db, session_id=session_id, user_id=current_user.id)
