# Negotiation Coach - AI-Powered Negotiation Simulator
> Status: In Progress | July 2026

An interactive multi-agent system that lets users practice real negotiations (starting with salary negotiation) against an AI opponent, while a second AI agent silently scores their tactics in real time and gives actionable coaching.

---

## Problem
Most people go into important negotiations (salary, deals, contracts) without practice, and get little honest feedback on their tactics afterward. Negotiation coaching is expensive and hard to access.

## Solution
Two cooperating AI agents:
- **Opponent Agent** -> roleplays a realistic counterpart (e.g. a hiring manager) with a hidden budget/position, responds naturally to pressure
- **Coach Agent** -> silently scores each message against a defined negotiation rubric (anchoring, leverage, concessions, confidence) and gives real-time feedback

---

## Tech Stack
- **Backend:** Python, FastAPI, Groq API (openai/gpt-oss-120b)
- **Frontend:** React (Vite), JavaScript
- **Hosting:** Render (backend), Vercel (frontend) - fully free tier

---

## Features
- Live chat-style negotiation with an AI opponent
- Real-time "tactics meter" scoring 4 negotiation skills
- Post-negotiation feedback and coaching tips
- Fully free to run (no paid APIs)

---

## Running Locally

### Backend
\```bash
- cd backend
- python -m venv venv
- venv\Scripts\activate        # Mac/Linux: source venv/bin/activate
- pip install -r requirements.txt
- *create a .env file with: GROQ_API_KEY=your_key_here*
- uvicorn main:app --reload
\```

---

## Team

- **[Akanksha Rawat]** -> Frontend, UI/UX design, React implementation
- **[Kushagra Yadav]** -> Backend, AI agent design, prompt engineering, API architecture


---