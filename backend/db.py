import sqlite3
import json
from datetime import datetime

DB_PATH = "sessions.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            visitor_id TEXT,
            scenario TEXT,
            created_at TEXT,
            updated_at TEXT,
            messages TEXT,
            latest_score TEXT
        )
    """)
    conn.commit()
    conn.close()

def save_session(session_id, visitor_id, scenario, messages, score_history):
    conn = sqlite3.connect(DB_PATH)
    now = datetime.utcnow().isoformat()
    existing = conn.execute("SELECT id FROM sessions WHERE id = ?", (session_id,)).fetchone()
    if existing:
        conn.execute(
            "UPDATE sessions SET messages = ?, latest_score = ?, updated_at = ?, scenario = ? WHERE id = ?",
            (json.dumps(messages), json.dumps(score_history), now, scenario, session_id)
        )
    else:
        conn.execute(
            "INSERT INTO sessions (id, visitor_id, scenario, created_at, updated_at, messages, latest_score) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (session_id, visitor_id, scenario, now, now, json.dumps(messages), json.dumps(score_history))
        )
    conn.commit()
    conn.close()

def list_sessions(visitor_id):
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute(
        "SELECT id, created_at, messages FROM sessions WHERE visitor_id = ? ORDER BY updated_at DESC",
        (visitor_id,)
    ).fetchall()
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
    row = conn.execute(
        "SELECT id, scenario, created_at, messages, latest_score FROM sessions WHERE id = ?", (session_id,)
    ).fetchone()
    conn.close()
    if not row:
        return None
    return {
        "id": row[0],
        "scenario": row[1] or "salary",
        "created_at": row[2],
        "messages": json.loads(row[3]),
        "latest_score": json.loads(row[4]) if row[4] else []
    }

def get_stats(visitor_id):
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute(
        "SELECT latest_score FROM sessions WHERE visitor_id = ?", (visitor_id,)
    ).fetchall()
    conn.close()

    total_sessions = len(rows)
    all_scores = []
    for row in rows:
        scores = json.loads(row[0]) if row[0] else []
        all_scores.extend(scores)

    if not all_scores:
        return {"total_sessions": total_sessions, "avg_score_percent": 0}

    avg = sum(s.get("total_score", 0) for s in all_scores) / (len(all_scores) * 8)
    return {"total_sessions": total_sessions, "avg_score_percent": round(avg * 100)}