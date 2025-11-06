import json
import redis
import os
from dotenv import load_dotenv

load_dotenv()

# 🔐 Redis connection setup
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
r = redis.Redis.from_url(REDIS_URL, decode_responses=True)

# ========================
# 🧠 Session Management
# ========================


def store_session(session_id: str, data: dict):
    """
    Store JSON-serializable data in Redis for a session.
    Automatically expires after `ttl` seconds (default: 30 minutes).
    """
    r.set(f"session:{session_id}", json.dumps(data))
    return True


def get_session(session_id: str) -> dict | None:
    """
    Retrieve session data from Redis.
    Returns None if session does not exist.
    """
    data = r.get(f"session:{session_id}")
    if not data:
        return None
    return json.loads(data)


def delete_session(session_id: str):
    """
    Delete a session from Redis.
    """
    r.delete(f"session:{session_id}")
    return True


# ========================
# 🧩 Session Initialization Helper
# ========================


def create_session(
    session_id: str, candidate_name: str, candidate_details: dict, job_description: str
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

    store_session(session_id, session_data)
    return session_data


def update_session_field(session_id: str, key: str, value):
    """
    Update a specific key inside the session without overwriting the full data.
    """
    session = get_session(session_id)
    if not session:
        raise ValueError(f"Session {session_id} not found")

    session[key] = value
    store_session(session_id, session)
    return True


# ========================
# 🧪 Example Usage (for testing)
# ========================
if __name__ == "__main__":
    session_id = "abc123"

    # ✅ Create session
    create_session(
        session_id,
        candidate_name="Rakesh",
        candidate_details={
            "skills": ["Next.js", "Python", "LLMs"],
            "education": "B.Tech in Computer Science",
            "experience": "2 years",
        },
        job_description="Looking for a full-stack developer skilled in AI tools.",
    )

    # ✅ Retrieve session
    session = get_session(session_id)
    print("Fetched session:", json.dumps(session, indent=2))

    # ✅ Update session
    update_session_field(session_id, "status", "completed")
    print("Updated session:", get_session(session_id))

    # ✅ Delete session
    # delete_session(session_id)
