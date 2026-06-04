"""
Unit tests for pure Python tree algorithm functions in tree_query agent.
"""
import pytest
from app.agents.tree_query import (
    get_height,
    get_leaf_nodes,
    get_node_count,
    preorder,
    inorder,
    postorder,
    get_parent,
)

NODES = {
    "n1": {"id": "n1", "value": 10, "left": "n2", "right": "n3", "parentId": None},
    "n2": {"id": "n2", "value": 5,  "left": "n4", "right": "n5", "parentId": "n1"},
    "n3": {"id": "n3", "value": 15, "left": None,  "right": None,  "parentId": "n1"},
    "n4": {"id": "n4", "value": 3,  "left": None,  "right": None,  "parentId": "n2"},
    "n5": {"id": "n5", "value": 7,  "left": None,  "right": None,  "parentId": "n2"},
}
ROOT_ID = "n1"


class TestGetHeight:
    def test_height_of_sample_tree(self):
        assert get_height(NODES, ROOT_ID) == 3

    def test_height_single_node(self):
        nodes = {"n1": {"id": "n1", "value": 1, "left": None, "right": None, "parentId": None}}
        assert get_height(nodes, "n1") == 1

    def test_height_empty_tree(self):
        assert get_height({}, None) == 0

    def test_height_two_levels(self):
        nodes = {
            "n1": {"id": "n1", "value": 1, "left": "n2", "right": None, "parentId": None},
            "n2": {"id": "n2", "value": 2, "left": None, "right": None, "parentId": "n1"},
        }
        assert get_height(nodes, "n1") == 2


class TestGetLeafNodes:
    def test_leaves_of_sample_tree(self):
        leaves = get_leaf_nodes(NODES, ROOT_ID)
        assert sorted(leaves) == [3, 7, 15]

    def test_single_node_is_leaf(self):
        nodes = {"n1": {"id": "n1", "value": 42, "left": None, "right": None, "parentId": None}}
        assert get_leaf_nodes(nodes, "n1") == [42]

    def test_empty_tree(self):
        assert get_leaf_nodes({}, None) == []


class TestGetNodeCount:
    def test_count_sample_tree(self):
        assert get_node_count(NODES) == 5

    def test_count_empty(self):
        assert get_node_count({}) == 0

    def test_count_single(self):
        nodes = {"n1": {"id": "n1", "value": 1, "left": None, "right": None, "parentId": None}}
        assert get_node_count(nodes) == 1


class TestTraversals:
    def test_preorder(self):
        result = preorder(NODES, ROOT_ID)
        assert result == [10, 5, 3, 7, 15]

    def test_inorder(self):
        result = inorder(NODES, ROOT_ID)
        assert result == [3, 5, 7, 10, 15]

    def test_postorder(self):
        result = postorder(NODES, ROOT_ID)
        assert result == [3, 7, 5, 15, 10]

    def test_traversal_empty_tree(self):
        assert preorder({}, None) == []
        assert inorder({}, None) == []
        assert postorder({}, None) == []


class TestGetParent:
    def test_parent_of_child(self):
        assert get_parent(NODES, 5) == 10
        assert get_parent(NODES, 15) == 10
        assert get_parent(NODES, 3) == 5

    def test_root_has_no_parent(self):
        assert get_parent(NODES, 10) is None

    def test_nonexistent_node(self):
        assert get_parent(NODES, 999) is None
