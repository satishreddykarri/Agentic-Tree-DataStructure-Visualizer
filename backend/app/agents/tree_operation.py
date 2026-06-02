import json
from langchain_google_genai import ChatGoogleGenerativeAI
from app.config import get_settings
from app.agents.state import AgentState

settings = get_settings()

OPERATION_PROMPT = """You are a binary tree operation parser.
Parse the user message into a structured JSON action for a generic binary tree.

The tree state is provided as context. Nodes are identified by their numeric value.

Supported operations:
- INSERT: Add a new node. Requires nodeValue, and if tree has nodes: parentValue and position (left/right)
- DELETE: Remove a node and all its children. Requires targetNodeValue
- EDIT: Change a node's value. Requires targetNodeValue and nodeValue (new value)
- RESET: Clear the entire tree. No additional fields needed

Current tree state:
{tree_state}

User message: {message}

Respond with ONLY valid JSON in this exact format:
{{
  "type": "INSERT" | "DELETE" | "EDIT" | "RESET",
  "nodeValue": <number or null>,
  "parentValue": <number or null>,
  "position": "left" | "right" | null,
  "targetNodeValue": <number or null>
}}

JSON:"""


def find_node_by_value(tree_state: dict, value: int) -> dict | None:
    nodes = tree_state.get("nodes", {})
    for node in nodes.values():
        if node.get("value") == value:
            return node
    return None


def apply_operation(tree_state: dict, action: dict) -> tuple[dict, str | None]:
    """Apply the parsed action to the tree state. Returns (updated_tree, error)."""
    import uuid
    op_type = action.get("type")
    nodes = dict(tree_state.get("nodes", {}))
    root_id = tree_state.get("rootId")

    if op_type == "RESET":
        return {"rootId": None, "nodes": {}}, None

    elif op_type == "INSERT":
        node_value = action.get("nodeValue")
        if node_value is None:
            return tree_state, "No node value provided"

        # Check for duplicate
        if find_node_by_value(tree_state, node_value):
            return tree_state, f"Node with value {node_value} already exists"

        new_id = str(uuid.uuid4())
        new_node = {"id": new_id, "value": node_value, "left": None, "right": None, "parentId": None}

        if not root_id:
            nodes[new_id] = new_node
            return {"rootId": new_id, "nodes": nodes}, None

        parent_value = action.get("parentValue")
        position = action.get("position")
        if parent_value is None or position not in ("left", "right"):
            return tree_state, "Parent value and position (left/right) required"

        parent = find_node_by_value({"nodes": nodes}, parent_value)
        if not parent:
            return tree_state, f"Parent node with value {parent_value} not found"

        if nodes[parent["id"]][position]:
            return tree_state, f"Node {parent_value} already has a {position} child"

        new_node["parentId"] = parent["id"]
        nodes[new_id] = new_node
        nodes[parent["id"]] = {**nodes[parent["id"]], position: new_id}
        return {"rootId": root_id, "nodes": nodes}, None

    elif op_type == "DELETE":
        target_value = action.get("targetNodeValue")
        if target_value is None:
            return tree_state, "No target node value provided"

        target = find_node_by_value(tree_state, target_value)
        if not target:
            return tree_state, f"Node with value {target_value} not found"

        # Collect all descendants
        to_delete = set()
        def collect(nid):
            to_delete.add(nid)
            n = nodes.get(nid, {})
            if n.get("left"): collect(n["left"])
            if n.get("right"): collect(n["right"])
        collect(target["id"])

        # Unlink from parent
        parent_id = target.get("parentId")
        if parent_id and parent_id in nodes:
            parent = dict(nodes[parent_id])
            if parent.get("left") == target["id"]: parent["left"] = None
            if parent.get("right") == target["id"]: parent["right"] = None
            nodes[parent_id] = parent

        for nid in to_delete:
            nodes.pop(nid, None)

        new_root = None if root_id in to_delete else root_id
        return {"rootId": new_root, "nodes": nodes}, None

    elif op_type == "EDIT":
        target_value = action.get("targetNodeValue")
        new_value = action.get("nodeValue")
        if target_value is None or new_value is None:
            return tree_state, "Target and new value required"

        target = find_node_by_value(tree_state, target_value)
        if not target:
            return tree_state, f"Node with value {target_value} not found"

        if find_node_by_value(tree_state, new_value) and new_value != target_value:
            return tree_state, f"Node with value {new_value} already exists"

        nodes[target["id"]] = {**nodes[target["id"]], "value": new_value}
        return {"rootId": root_id, "nodes": nodes}, None

    return tree_state, f"Unknown operation type: {op_type}"


def tree_operation_node(state: AgentState) -> AgentState:
    """Parses user message into a tree action and applies it to the tree state."""
    try:
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            google_api_key=settings.gemini_api_key,
            temperature=0,
        )

        prompt = OPERATION_PROMPT.format(
            message=state["message"],
            tree_state=json.dumps(state["tree_state"], indent=2),
        )

        response = llm.invoke(prompt)
        raw = response.content.strip()

        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        action = json.loads(raw)

        # Apply the operation
        updated_tree, error = apply_operation(state["tree_state"], action)

        if error:
            return {**state, "action": None, "error": error}

        return {
            **state,
            "action": {**action, "updated_tree": updated_tree},
            "tree_state": updated_tree,
            "error": None,
        }

    except json.JSONDecodeError as e:
        return {**state, "action": None, "error": f"Could not parse operation: {e}"}
    except Exception as e:
        return {**state, "action": None, "error": str(e)}
