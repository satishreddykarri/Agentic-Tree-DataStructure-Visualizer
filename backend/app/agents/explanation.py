import json
from langchain_google_genai import ChatGoogleGenerativeAI
from app.config import get_settings
from app.agents.state import AgentState

settings = get_settings()

EXPLANATION_PROMPT = """You are a friendly AI assistant for a binary tree visualization app called Agentic Tree.
Generate a short, clear, educational response for the user.

Original user message: {message}
Intent: {intent}
Result/Action: {action}
Error (if any): {error}

Guidelines:
- If there was an error, explain it clearly and suggest how to fix it
- If it was a tree operation (insert/delete/edit/reset), confirm what was done in 1-2 sentences
- If it was a query, explain the result clearly with the actual values
- Keep it conversational and friendly
- For traversals, show the sequence like: 10 → 5 → 15
- If the tree is empty and user asks about it, gently let them know
- Never mention internal implementation details

Response (2-3 sentences max):"""


def explanation_node(state: AgentState) -> AgentState:
    """Generates a human-readable explanation using Gemini."""
    try:
        # If no API key configured, return a basic fallback
        if not settings.gemini_api_key:
            explanation = _fallback_explanation(state)
            return {**state, "explanation": explanation}

        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=settings.gemini_api_key,
            temperature=0.3,
        )

        action_str = json.dumps(state.get("action"), indent=2) if state.get("action") else "None"

        prompt = EXPLANATION_PROMPT.format(
            message=state["message"],
            intent=state.get("intent", "UNKNOWN"),
            action=action_str,
            error=state.get("error") or "None",
        )

        response = llm.invoke(prompt)
        explanation = response.content.strip()

        return {**state, "explanation": explanation}

    except Exception as e:
        # Fallback to rule-based explanation if Gemini fails
        explanation = _fallback_explanation(state)
        return {**state, "explanation": explanation}


def _fallback_explanation(state: AgentState) -> str:
    """Rule-based fallback when Gemini is unavailable."""
    error = state.get("error")
    action = state.get("action")
    intent = state.get("intent", "UNKNOWN")

    if error:
        return f"Sorry, I couldn't complete that: {error}"

    if intent == "TREE_OPERATION" and action:
        op_type = action.get("type", "")
        if op_type == "INSERT":
            val = action.get("nodeValue")
            parent = action.get("parentValue")
            pos = action.get("position")
            if parent:
                return f"Done! Node {val} has been inserted as the {pos} child of node {parent}."
            return f"Done! Node {val} has been set as the root."
        elif op_type == "DELETE":
            return f"Node {action.get('targetNodeValue')} and its subtree have been deleted."
        elif op_type == "EDIT":
            return f"Node {action.get('targetNodeValue')} has been updated to {action.get('nodeValue')}."
        elif op_type == "RESET":
            return "The tree has been reset. All nodes removed."

    if intent == "TREE_QUERY" and action:
        query_type = action.get("query_type", "")
        result = action.get("result")
        if query_type == "height":
            return f"The height of the tree is {result}."
        elif query_type == "leaf_nodes":
            return f"The leaf nodes are: {', '.join(str(v) for v in result)}."
        elif query_type == "node_count":
            return f"The tree has {result} node{'s' if result != 1 else ''}."
        elif query_type in ("preorder", "inorder", "postorder"):
            seq = " → ".join(str(v) for v in result)
            return f"{query_type.capitalize()} traversal: {seq}"
        elif query_type == "empty":
            return "The tree is empty. Add some nodes first!"

    return "I'm not sure how to help with that. Try asking about tree operations or queries."
