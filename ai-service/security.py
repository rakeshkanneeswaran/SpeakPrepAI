from fastapi import Request, HTTPException
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("AI_API_KEY")


async def verify_token(request: Request):
    auth = request.headers.get("Authorization")

    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Missing token"
        )

    token = auth.split(" ", 1)[1]

    if not API_KEY:
        raise HTTPException(
            status_code=500,
            detail="AI_API_KEY is not configured"
        )

    if token != API_KEY:
        raise HTTPException(
            status_code=403,
            detail="Invalid token"
        )

    return True