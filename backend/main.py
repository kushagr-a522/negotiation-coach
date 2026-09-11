from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents import opponent_agent, coach_agent
from db import init_db, save_session, list_sessions, get_session

app = FastAPI()
init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class NegotiationRequest(BaseModel):
    session_id: str
    conversation_history: list
    latest_message: str

@app.post("/negotiate")
def negotiate(req: NegotiationRequest):
    updated_history = req.conversation_history + [{"role": "user", "content": req.latest_message}]
    score = coach_agent(req.latest_message, updated_history)
    ai_reply = opponent_agent(updated_history)

    full_history = updated_history + [{"role": "assistant", "content": ai_reply}]
    save_session(req.session_id, full_history, score)

    return {"ai_reply": ai_reply, "score": score}

@app.get("/sessions")
def get_sessions():
    return list_sessions()

@app.get("/sessions/{session_id}")
def get_session_detail(session_id: str):
    session = get_session(session_id)
    if not session:
        return {"error": "Session not found"}
    return session

@app.get("/")
def health_check():
    return {"status": "backend is running"}