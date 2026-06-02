from langchain_google_genai import ChatGoogleGenerativeAI
from app.config import get_settings
from app.agents.state import AgentState

settings = get_settings()

# Few-shot examples to guide classification
SUPERVISOR_PROMPT = """You are an intent classifier for a binary tree application.
Classify the user message into exactly one of these intents:
- TREE_OPERATION: user wants to insert, delete, edit, reset, or modify the tree
- TREE_QUERY: user wants to know something about the tree (height, traversal, leaf nodes, count, etc.)
- UNKNOWN: message does not relate to tree operations or queries

Examples:
"Insert node 5 as left child of node 10" -> TREE_OPERATION
"Add a root node with value 8" -> TREE_OPERATION
"Delete node 3" -> TREE_OPERATION
"Reset the tree" -> TREE_OPERATION
"What is the height of the tree?" -> TREE_QUERY
"Show me the inorder traversal" -> TREE_QUERY
"How many nodes are there?" -> TREE_QUERY
"List all leaf nodes" -> TREE_QUERY
"What is the parent of node 5?" -> TREE_QUERY
"Hello how are you" -> UNKNOWN
"What is a binary tree?" -> TREE_QUERY

Respond with ONLY the intent label, nothing else.

User message: {message}
Intent:"""


def supervisor_node(state: AgentState) -> AgentState:
    """Classifies user intent and sets state['intent']."""
    try:
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            google_api_key=settings.gemini_api_key,
            temperature=0,
        )

        prompt = SUPERVISOR_PROMPT.format(message=state["message"])
        response = llm.invoke(prompt)
        intent = response.content.strip().upper()

        # Validate intent
        valid_intents = {"TREE_OPERATION", "TREE_QUERY", "UNKNOWN"}
        if intent not in valid_intents:
            intent = "UNKNOWN"

        return {**state, "intent": intent, "error": None}

    except Exception as e:
        return {**state, "intent": "UNKNOWN", "error": str(e)}
