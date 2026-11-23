import sqlite3
import json
import uuid
from datetime import datetime, timezone

DB_PATH = "sessions.db"


def _now():
    return datetime.now(timezone.utc).isoformat()


def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            scenario TEXT,
            created_at TEXT,
            updated_at TEXT,
            messages TEXT,
            latest_score TEXT
        )
    """)
    conn.commit()
    conn.close()


# ---------- users ----------

def _user_from_row(row):
    if not row:
        return None
    return {"id": row[0], "email": row[1], "name": row[2], "password_hash": row[3]}


def create_user(email, name, password_hash):
    conn = sqlite3.connect(DB_PATH)
    user_id = str(uuid.uuid4())
    try:
        conn.execute(
            "INSERT INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
            (user_id, email, name, password_hash, _now()),
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return None
    conn.close()
    return {"id": user_id, "email": email, "name": name}


def get_user_by_email(email):
    conn = sqlite3.connect(DB_PATH)
    row = conn.execute(
        "SELECT id, email, name, password_hash FROM users WHERE email = ?", (email,)
    ).fetchone()
    conn.close()
    return _user_from_row(row)


def get_user_by_id(user_id):
    conn = sqlite3.connect(DB_PATH)
    row = conn.execute(
        "SELECT id, email, name, password_hash FROM users WHERE id = ?", (user_id,)
    ).fetchone()
    conn.close()
    return _user_from_row(row)


# ---------- sessions (every query is scoped to the user) ----------

def save_session(session_id, user_id, scenario, messages, score_history):
    conn = sqlite3.connect(DB_PATH)
    now = _now()
    existing = conn.execute(
        "SELECT user_id FROM sessions WHERE id = ?", (session_id,)
    ).fetchone()

    if existing:
        if existing[0] != user_id:
            conn.close()
            raise PermissionError("Session belongs to another user")
        conn.execute(
            "UPDATE sessions SET messages = ?, latest_score = ?, updated_at = ?, scenario = ? WHERE id = ?",
            (json.dumps(messages), json.dumps(score_history), now, scenario, session_id),
        )
    else:
        conn.execute(
            "INSERT INTO sessions (id, user_id, scenario, created_at, updated_at, messages, latest_score) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (session_id, user_id, scenario, now, now, json.dumps(messages), json.dumps(score_history)),
        )
    conn.commit()
    conn.close()


def list_sessions(user_id):
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute(
        "SELECT id, created_at, messages FROM sessions WHERE user_id = ? ORDER BY updated_at DESC",
        (user_id,),
    ).fetchall()
    conn.close()

    result = []
    for row in rows:
        messages = json.loads(row[2])
        first_user_msg = next(
            (m["content"] for m in messages if m["role"] == "user"), "New negotiation"
        )
        result.append({
            "id": row[0],
            "created_at": row[1],
            "preview": first_user_msg[:60],
            "message_count": len(messages),
        })
    return result


def get_session(session_id, user_id):
    conn = sqlite3.connect(DB_PATH)
    row = conn.execute(
        "SELECT id, scenario, created_at, messages, latest_score FROM sessions WHERE id = ? AND user_id = ?",
        (session_id, user_id),
    ).fetchone()
    conn.close()
    if not row:
        return None
    return {
        "id": row[0],
        "scenario": row[1] or "salary",
        "created_at": row[2],
        "messages": json.loads(row[3]),
        "latest_score": json.loads(row[4]) if row[4] else [],
    }


def get_stats(user_id):
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute(
        "SELECT latest_score FROM sessions WHERE user_id = ?", (user_id,)
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