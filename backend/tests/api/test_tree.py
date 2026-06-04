"""
API tests for tree session endpoints.
"""


class TestSessionCRUD:
    def test_create_session(self, client, auth_headers):
        response = client.post("/tree/session",
            json={"name": "My Test Tree"},
            headers=auth_headers,
        )
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "My Test Tree"
        assert "id" in data
        assert data["tree_json"] == {"rootId": None, "nodes": {}}

    def test_list_sessions(self, client, auth_headers):
        client.post("/tree/session", json={"name": "List Test"}, headers=auth_headers)
        response = client.get("/tree/sessions", headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        assert len(response.json()) >= 1

    def test_get_session(self, client, auth_headers):
        create_resp = client.post("/tree/session",
            json={"name": "Get Test"},
            headers=auth_headers,
        )
        session_id = create_resp.json()["id"]
        response = client.get(f"/tree/session/{session_id}", headers=auth_headers)
        assert response.status_code == 200
        assert response.json()["id"] == session_id

    def test_update_session_name(self, client, auth_headers):
        create_resp = client.post("/tree/session",
            json={"name": "Old Name"},
            headers=auth_headers,
        )
        session_id = create_resp.json()["id"]
        response = client.put(f"/tree/session/{session_id}",
            json={"name": "New Name"},
            headers=auth_headers,
        )
        assert response.status_code == 200
        assert response.json()["name"] == "New Name"

    def test_update_tree_json(self, client, auth_headers):
        create_resp = client.post("/tree/session",
            json={"name": "Tree Update Test"},
            headers=auth_headers,
        )
        session_id = create_resp.json()["id"]
        tree_data = {
            "rootId": "node-1",
            "nodes": {
                "node-1": {"id": "node-1", "value": 10, "left": None, "right": None, "parentId": None}
            }
        }
        response = client.put(f"/tree/session/{session_id}",
            json={"tree_json": tree_data},
            headers=auth_headers,
        )
        assert response.status_code == 200
        assert response.json()["tree_json"]["rootId"] == "node-1"

    def test_delete_session(self, client, auth_headers):
        create_resp = client.post("/tree/session",
            json={"name": "Delete Me"},
            headers=auth_headers,
        )
        session_id = create_resp.json()["id"]
        response = client.delete(f"/tree/session/{session_id}", headers=auth_headers)
        assert response.status_code == 204
        get_resp = client.get(f"/tree/session/{session_id}", headers=auth_headers)
        assert get_resp.status_code == 404

    def test_get_nonexistent_session(self, client, auth_headers):
        response = client.get("/tree/session/nonexistent-id", headers=auth_headers)
        assert response.status_code == 404

    def test_unauthenticated_access(self, client):
        response = client.get("/tree/sessions")
        assert response.status_code == 403
