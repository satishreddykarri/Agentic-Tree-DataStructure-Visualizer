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
        return "operation_agent"
    elif intent == "TREE_QUERY":
        return "query_agent"
    else:
        return "explain_agent"


def build_graph() -> StateGraph:
    graph = StateGraph(AgentState)

    # Add nodes — names must not clash with AgentState field names
    graph.add_node("supervisor_agent", supervisor_node)
    graph.add_node("operation_agent", tree_operation_node)
    graph.add_node("query_agent", tree_query_node)
    graph.add_node("explain_agent", explanation_node)

    # Entry point
    graph.set_entry_point("supervisor_agent")

    # Conditional routing after supervisor
    graph.add_conditional_edges(
        "supervisor_agent",
        route_after_supervisor,
        {
            "operation_agent": "operation_agent",
            "query_agent": "query_agent",
            "explain_agent": "explain_agent",
        },
    )

    # Both agents flow into explanation
    graph.add_edge("operation_agent", "explain_agent")
    graph.add_edge("query_agent", "explain_agent")
    graph.add_edge("explain_agent", END)

    return graph


# Compiled graph — imported by chat service
compiled_graph = build_graph().compile()
