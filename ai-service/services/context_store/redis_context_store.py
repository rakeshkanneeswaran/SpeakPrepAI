import json
import redis
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# 🔐 Redis connection setup
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# ✅ Create a single global Redis client (connection pool managed internally)
redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)


# ---------- SESSION STORE MANAGER ---------- #
class RedisContextStoreManager:
    """
    Handles session storage and retrieval using Redis.
    A single global redis_client instance is reused across all methods.
    """

    @staticmethod
    def store_session(session_id: str, data: dict, ttl: int = 3600):
        """
        Store JSON-serializable data in Redis for a session.
        Automatically expires after `ttl` seconds (default: 1 hour).
        """
        redis_client.set(f"session:{session_id}", json.dumps(data), ex=ttl)
        return True

    @staticmethod
    def get_session(session_id: str) -> dict | None:
        """
        Retrieve session data from Redis.
        Returns None if session does not exist.
        """
        data = redis_client.get(f"session:{session_id}")
        return json.loads(data) if data else None

    @staticmethod
    def delete_session(session_id: str):
        """
        Delete a session from Redis.
        """
        redis_client.delete(f"session:{session_id}")
        return True

    @staticmethod
    def update_session_field(session_id: str, key: str, value):
        """
        Update a specific key inside the session without overwriting the full data.
        """
        session = RedisContextStoreManager.get_session(session_id)
        if not session:
            raise ValueError(f"Session {session_id} not found")

        session[key] = value
        RedisContextStoreManager.store_session(session_id, session)
        return True

    @staticmethod
    def create_session(
        session_id: str,
        candidate_name: str,
        candidate_details: dict,
        job_description: str,
    ):
        """
        Initialize a new interview session with metadata.
        Includes candidate profile, job description, and session state.
        """
        session_data = {
            "candidate_name": candidate_name,
            "candidate_details": {
                "skills": candidate_details.get("skills", []),
                "education": candidate_details.get("education", ""),
                "experience": candidate_details.get("experience", ""),
            },
            "job_description": job_description,
            "questions": [],
            "answers": [],
            "no_of_requests": 0,
            "status": "in_progress",
        }

        RedisContextStoreManager.store_session(session_id, session_data)
        return session_id


redis_context_store_manager = RedisContextStoreManager()
