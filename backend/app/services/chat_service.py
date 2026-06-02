from sqlalchemy.orm import Session
from app.agents.graph import compiled_graph
from app.repositories.chat_repository import save_message, get_history, delete_history
from app.models.chat_history import ChatHistory


def process_message(
    db: Session,
    user_id: str,
    session_id: str,
    message: str,
    tree_state: dict,
) -> dict:
    """
    Runs the LangGraph pipeline and persists both the user message
    and the AI response to the database.
    """
    # Persist user message
    save_message(db, user_id=user_id, session_id=session_id, role="user", message=message)

    # Run the agent graph
    initial_state = {
        "message": message,
        "intent": "",
        "tree_state": tree_state,
        "action": None,
        "explanation": "",
        "error": None,
    }

    result = compiled_graph.invoke(initial_state)

    explanation = result.get("explanation") or "I'm not sure how to help with that."
    action = result.get("action")
    error = result.get("error")

    # If there was an error, include it in the explanation
    if error and not explanation:
        explanation = f"Sorry, something went wrong: {error}"

    # Persist AI response
    save_message(db, user_id=user_id, session_id=session_id, role="assistant", message=explanation)

    # Extract updated tree if an operation was performed
    updated_tree = None
    if action and "updated_tree" in action:
        updated_tree = action["updated_tree"]

    return {
        "explanation": explanation,
        "action": action,
        "updated_tree": updated_tree,
    }


def get_chat_history(db: Session, session_id: str, user_id: str) -> list[ChatHistory]:
    return get_history(db, session_id)


def clear_chat_history(db: Session, session_id: str, user_id: str) -> None:
    delete_history(db, session_id)
