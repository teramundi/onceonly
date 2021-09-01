import unittest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

class TestRoutes(unittest.TestCase):

    def test_home(self):
        response = client.get("/")
        self.assertEqual(response.status_code, 404)