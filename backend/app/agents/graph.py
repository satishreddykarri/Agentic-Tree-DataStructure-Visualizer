from langgraph.graph import StateGraph, END
from app.agents.state import AgentState
from app.agents.supervisor import supervisor_node
from app.agents.tree_operation import tree_operation_node
from app.agents.tree_query import tree_query_node
from app.agents.explanation import explanation_node


def route_after_supervisor(state: AgentState) -> str:
    """Route to the correct agent based on classified intent."""
    intent = state.get("intent", "UNKNOWN")
    if intent == "TREE_OPERATION":
        return "tree_operation"
    elif intent == "TREE_QUERY":
        return "tree_query"
    else:
        return "explanation"


def build_graph() -> StateGraph:
    graph = StateGraph(AgentState)

    # Add nodes
    graph.add_node("supervisor", supervisor_node)
    graph.add_node("tree_operation", tree_operation_node)
    graph.add_node("tree_query", tree_query_node)
    graph.add_node("explanation", explanation_node)

    # Entry point
    graph.set_entry_point("supervisor")

    # Conditional routing after supervisor
    graph.add_conditional_edges(
        "supervisor",
        route_after_supervisor,
        {
            "tree_operation": "tree_operation",
            "tree_query": "tree_query",
            "explanation": "explanation",
        },
    )

    # Both agents flow into explanation
    graph.add_edge("tree_operation", "explanation")
    graph.add_edge("tree_query", "explanation")
    graph.add_edge("explanation", END)

    return graph


# Compiled graph — imported by chat service
compiled_graph = build_graph().compile()
