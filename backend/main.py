from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents import opponent_agent, coach_agent

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class NegotiationRequest(BaseModel):
    conversation_history: list
    latest_message: str

@app.post("/negotiate")
def negotiate(req: NegotiationRequest):
    updated_history = req.conversation_history + [{"role": "user", "content": req.latest_message}]
    score = coach_agent(req.latest_message, updated_history)
    ai_reply = opponent_agent(updated_history)
    return {"ai_reply": ai_reply, "score": score}

@app.get("/")
def health_check():
    return {"status": "backend is running"}