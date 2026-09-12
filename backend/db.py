import sqlite3
import json
from datetime import datetime

DB_PATH = "sessions.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            created_at TEXT,
            updated_at TEXT,
            messages TEXT,
            latest_score TEXT
        )
    """)
    conn.commit()
    conn.close()

def save_session(session_id, messages, score_history):
    conn = sqlite3.connect(DB_PATH)
    now = datetime.utcnow().isoformat()
    existing = conn.execute("SELECT id FROM sessions WHERE id = ?", (session_id,)).fetchone()
    if existing:
        conn.execute(
            "UPDATE sessions SET messages = ?, latest_score = ?, updated_at = ? WHERE id = ?",
            (json.dumps(messages), json.dumps(score_history), now, session_id)
        )
    else:
        conn.execute(
            "INSERT INTO sessions (id, created_at, updated_at, messages, latest_score) VALUES (?, ?, ?, ?, ?)",
            (session_id, now, now, json.dumps(messages), json.dumps(score_history))
        )
    conn.commit()
    conn.close()

def list_sessions():
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute("SELECT id, created_at, messages FROM sessions ORDER BY updated_at DESC").fetchall()
    conn.close()
    result = []
    for row in rows:
        messages = json.loads(row[2])
        first_user_msg = next((m["content"] for m in messages if m["role"] == "user"), "New negotiation")
        result.append({
            "id": row[0],
            "created_at": row[1],
            "preview": first_user_msg[:60],
            "message_count": len(messages)
        })
    return result

def get_session(session_id):
    conn = sqlite3.connect(DB_PATH)
    row = conn.execute("SELECT id, created_at, messages, latest_score FROM sessions WHERE id = ?", (session_id,)).fetchone()
    conn.close()
    if not row:
        return None
    return {
        "id": row[0],
        "created_at": row[1],
        "messages": json.loads(row[2]),
        "latest_score": json.loads(row[3]) if row[3] else None
    }