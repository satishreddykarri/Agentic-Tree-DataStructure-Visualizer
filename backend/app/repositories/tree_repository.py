from sqlalchemy.orm import Session
from app.models.tree_session import TreeSession


def create_session(db: Session, user_id: str, name: str) -> TreeSession:
    session = TreeSession(
        user_id=user_id,
        name=name,
        tree_json={"rootId": None, "nodes": {}},
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def get_session(db: Session, session_id: str) -> TreeSession | None:
    return db.query(TreeSession).filter(TreeSession.id == session_id).first()


def list_sessions(db: Session, user_id: str) -> list[TreeSession]:
    return (
        db.query(TreeSession)
        .filter(TreeSession.user_id == user_id)
        .order_by(TreeSession.updated_at.desc())
        .all()
    )


def update_session(
    db: Session,
    session: TreeSession,
    name: str | None = None,
    tree_json: dict | None = None,
) -> TreeSession:
    if name is not None:
        session.name = name
    if tree_json is not None:
        session.tree_json = tree_json
    db.commit()
    db.refresh(session)
    return session


def delete_session(db: Session, session: TreeSession) -> None:
    db.delete(session)
    db.commit()
