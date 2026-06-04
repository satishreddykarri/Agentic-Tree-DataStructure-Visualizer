"""
API tests for chat endpoints.
"""
from unittest.mock import patch


class TestChatHistory:
    def get_session_id(self, client, auth_headers):
        resp = client.post("/tree/session",
            json={"name": "Chat Test Session"},
            headers=auth_headers,
        )
        return resp.json()["id"]

    def test_get_empty_history(self, client, auth_headers):
        session_id = self.get_session_id(client, auth_headers)
        response = client.get(f"/chat/history/{session_id}", headers=auth_headers)
        assert response.status_code == 200
        assert response.json() == []

    def test_delete_chat_history(self, client, auth_headers):
        session_id = self.get_session_id(client, auth_headers)
        response = client.delete(f"/chat/history/{session_id}", headers=auth_headers)
        assert response.status_code == 204

    def test_chat_history_unauthenticated(self, client):
        response = client.get("/chat/history/some-id")
        assert response.status_code == 403


class TestChatMessage:
    def get_session_id(self, client, auth_headers):
        resp = client.post("/tree/session",
            json={"name": "Chat Message Test"},
            headers=auth_headers,
        )
        return resp.json()["id"]

    def test_send_message_with_mocked_graph(self, client, auth_headers):
        session_id = self.get_session_id(client, auth_headers)

        mock_result = {
            "explanation": "Done! Node 10 has been set as the root.",
            "action": {"type": "INSERT", "nodeValue": 10, "updated_tree": {"rootId": "n1", "nodes": {}}},
            "error": None,
        }

        with patch("app.services.chat_service.compiled_graph") as mock_graph:
            mock_graph.invoke.return_value = mock_result
            response = client.post("/chat/message",
                json={
                    "session_id": session_id,
                    "message": "insert node 10 as root",
                    "tree_state": {"rootId": None, "nodes": {}},
                },
                headers=auth_headers,
            )

        assert response.status_code == 200
        data = response.json()
        assert "explanation" in data
        assert data["explanation"] == "Done! Node 10 has been set as the root."

    def test_chat_message_persisted_to_history(self, client, auth_headers):
        session_id = self.get_session_id(client, auth_headers)

        mock_result = {
            "explanation": "The tree has 0 nodes.",
            "action": None,
            "error": None,
        }

        with patch("app.services.chat_service.compiled_graph") as mock_graph:
            mock_graph.invoke.return_value = mock_result
            client.post("/chat/message",
                json={
                    "session_id": session_id,
                    "message": "how many nodes are there?",
                    "tree_state": {"rootId": None, "nodes": {}},
                },
                headers=auth_headers,
            )

        history = client.get(f"/chat/history/{session_id}", headers=auth_headers)
        assert history.status_code == 200
        messages = history.json()
        assert len(messages) == 2
        roles = [m["role"] for m in messages]
        assert "user" in roles
        assert "assistant" in roles
