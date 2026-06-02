from app.agents.state import AgentState

# ─── Pure Python Tree Algorithms ──────────────────────────────────────────────

def get_height(nodes: dict, node_id: str | None) -> int:
    if not node_id or node_id not in nodes:
        return 0
    node = nodes[node_id]
    return 1 + max(
        get_height(nodes, node.get("left")),
        get_height(nodes, node.get("right")),
    )


def get_leaf_nodes(nodes: dict, node_id: str | None) -> list[int]:
    if not node_id or node_id not in nodes:
        return []
    node = nodes[node_id]
    if not node.get("left") and not node.get("right"):
        return [node["value"]]
    return (
        get_leaf_nodes(nodes, node.get("left")) +
        get_leaf_nodes(nodes, node.get("right"))
    )


def get_node_count(nodes: dict) -> int:
    return len(nodes)


def preorder(nodes: dict, node_id: str | None) -> list[int]:
    if not node_id or node_id not in nodes:
        return []
    node = nodes[node_id]
    return (
        [node["value"]] +
        preorder(nodes, node.get("left")) +
        preorder(nodes, node.get("right"))
    )


def inorder(nodes: dict, node_id: str | None) -> list[int]:
    if not node_id or node_id not in nodes:
        return []
    node = nodes[node_id]
    return (
        inorder(nodes, node.get("left")) +
        [node["value"]] +
        inorder(nodes, node.get("right"))
    )


def postorder(nodes: dict, node_id: str | None) -> list[int]:
    if not node_id or node_id not in nodes:
        return []
    node = nodes[node_id]
    return (
        postorder(nodes, node.get("left")) +
        postorder(nodes, node.get("right")) +
        [node["value"]]
    )


def get_parent(nodes: dict, value: int) -> int | None:
    for node in nodes.values():
        if node.get("value") == value:
            parent_id = node.get("parentId")
            if parent_id and parent_id in nodes:
                return nodes[parent_id]["value"]
            return None
    return None


def find_node_by_value(nodes: dict, value: int) -> dict | None:
    return next((n for n in nodes.values() if n.get("value") == value), None)


# ─── Query Dispatcher ─────────────────────────────────────────────────────────

def dispatch_query(message: str, tree_state: dict) -> dict:
    """
    Determines which query to run based on keywords in the message.
    Returns a structured result dict passed to the explanation agent.
    """
    nodes = tree_state.get("nodes", {})
    root_id = tree_state.get("rootId")
    msg = message.lower()

    if not nodes:
        return {"query_type": "empty", "result": "The tree is empty."}

    if "height" in msg or "depth" in msg:
        h = get_height(nodes, root_id)
        return {"query_type": "height", "result": h}

    if "leaf" in msg:
        leaves = get_leaf_nodes(nodes, root_id)
        return {"query_type": "leaf_nodes", "result": leaves}

    if "count" in msg or "how many" in msg or "number of" in msg:
        count = get_node_count(nodes)
        return {"query_type": "node_count", "result": count}

    if "preorder" in msg or "pre-order" in msg or "pre order" in msg:
        seq = preorder(nodes, root_id)
        return {"query_type": "preorder", "result": seq}

    if "inorder" in msg or "in-order" in msg or "in order" in msg:
        seq = inorder(nodes, root_id)
        return {"query_type": "inorder", "result": seq}

    if "postorder" in msg or "post-order" in msg or "post order" in msg:
        seq = postorder(nodes, root_id)
        return {"query_type": "postorder", "result": seq}

    if "traversal" in msg:
        seq = inorder(nodes, root_id)
        return {"query_type": "inorder", "result": seq}

    if "parent" in msg:
        # Extract number from message
        import re
        numbers = re.findall(r"\d+", msg)
        if numbers:
            val = int(numbers[0])
            parent_val = get_parent(nodes, val)
            return {"query_type": "parent", "result": parent_val, "target": val}

    if "child" in msg or "children" in msg:
        import re
        numbers = re.findall(r"\d+", msg)
        if numbers:
            val = int(numbers[0])
            node = find_node_by_value(nodes, val)
            if node:
                left_id = node.get("left")
                right_id = node.get("right")
                left_val = nodes[left_id]["value"] if left_id and left_id in nodes else None
                right_val = nodes[right_id]["value"] if right_id and right_id in nodes else None
                return {
                    "query_type": "children",
                    "result": {"left": left_val, "right": right_val},
                    "target": val,
                }

    if "root" in msg:
        if root_id and root_id in nodes:
            return {"query_type": "root", "result": nodes[root_id]["value"]}

    # Fallback — return basic tree info
    count = get_node_count(nodes)
    h = get_height(nodes, root_id)
    return {
        "query_type": "summary",
        "result": {"node_count": count, "height": h},
    }


def tree_query_node(state: AgentState) -> AgentState:
    """Computes the answer from the tree state using pure Python algorithms."""
    try:
        result = dispatch_query(state["message"], state["tree_state"])
        return {**state, "action": result, "error": None}
    except Exception as e:
        return {**state, "action": None, "error": str(e)}
