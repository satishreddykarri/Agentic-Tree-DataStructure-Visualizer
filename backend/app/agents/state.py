from typing import TypedDict, Any


class AgentState(TypedDict):
    # Original user message
    message: str

    # Classified intent: TREE_OPERATION | TREE_QUERY | UNKNOWN
    intent: str

    # Current tree state sent from frontend
    tree_state: dict[str, Any]

    # Structured result from operation or query agent
    action: dict[str, Any] | None

    # Final human-readable response from explanation agent
    explanation: str

    # Error message if something went wrong
    error: str | None
