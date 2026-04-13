from fastapi import Request, HTTPException
import os

API_KEY = os.getenv("AI_API_KEY")


async def verify_token(request: Request):
    auth = request.headers.get("Authorization")

    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")

    token = auth.split(" ")[1]

    if token != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid token")
