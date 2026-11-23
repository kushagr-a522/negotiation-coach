import os
import re

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agents import coach_agent, opponent_agent
from auth import create_token, get_current_user, hash_password, verify_password
from db import (
    create_user,
    get_session,
    get_stats,
    get_user_by_email,
    init_db,
    list_sessions,
    save_session,
)

app = FastAPI()
init_db()

# Set ALLOWED_ORIGINS on Render to your Vercel URL (no trailing slash) to lock this down.
origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "*").split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class NegotiationRequest(BaseModel):
    session_id: str
    conversation_history: list
    latest_message: str
    score_history: list = []
    scenario: str = "salary"
    difficulty: str = "medium"
    focus: str = "general"


# ---------- auth ----------

@app.post("/auth/register")
def register(req: RegisterRequest):
    name = req.name.strip()
    email = req.email.strip().lower()

    if not name or len(name) > 50:
        raise HTTPException(status_code=400, detail="Please enter your name (up to 50 characters).")
    if not EMAIL_RE.match(email):
        raise HTTPException(status_code=400, detail="Please enter a valid email address.")
    if len(req.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")
    if len(req.password.encode("utf-8")) > 72:
        raise HTTPException(status_code=400, detail="Password is too long (72 characters maximum).")

    user = create_user(email, name, hash_password(req.password))
    if user is None:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    return {"token": create_token(user["id"]), "user": user}


@app.post("/auth/login")
def login(req: LoginRequest):
    email = req.email.strip().lower()
    user = get_user_by_email(email)

    # Same message for "no such email" and "wrong password" on purpose.
    if user is None or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")

    public_user = {"id": user["id"], "email": user["email"], "name": user["name"]}
    return {"token": create_token(user["id"]), "user": public_user}


@app.get("/auth/me")
def me(user: dict = Depends(get_current_user)):
    return user


# ---------- app endpoints (all require login) ----------

@app.post("/negotiate")
def negotiate(req: NegotiationRequest, user: dict = Depends(get_current_user)):
    if len(req.latest_message) > 2000:
        raise HTTPException(status_code=400, detail="Message is too long (2000 characters maximum).")

    updated_history = req.conversation_history + [{"role": "user", "content": req.latest_message}]
    score = coach_agent(req.latest_message, updated_history, req.focus)
    ai_reply = opponent_agent(updated_history, req.scenario, req.difficulty)

    full_history = updated_history + [{"role": "assistant", "content": ai_reply}]
    full_scores = req.score_history + [score]

    try:
        save_session(req.session_id, user["id"], req.scenario, full_history, full_scores)
    except PermissionError:
        raise HTTPException(status_code=403, detail="This session belongs to another account.")

    return {"ai_reply": ai_reply, "score": score}


@app.get("/sessions")
def get_sessions(user: dict = Depends(get_current_user)):
    return list_sessions(user["id"])


@app.get("/sessions/{session_id}")
def get_session_detail(session_id: str, user: dict = Depends(get_current_user)):
    session = get_session(session_id, user["id"])
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    return session


@app.get("/stats")
def stats(user: dict = Depends(get_current_user)):
    return get_stats(user["id"])


@app.get("/")
def health_check():
    return {"status": "backend is running"}