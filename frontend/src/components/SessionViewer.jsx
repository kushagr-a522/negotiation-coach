import { useEffect, useState } from "react";
import { getSession } from "../api";

export default function SessionViewer({ sessionId, onScoreUpdate }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    getSession(sessionId).then((data) => {
      setSession(data);
      onScoreUpdate(data.latest_score);
    });
  }, [sessionId]);

  if (!session) return <div className="center-panel"><p className="chat-empty-hint">Loading...</p></div>;

  return (
    <div className="center-panel">
      <div className="viewing-banner">Viewing a past negotiation (read-only)</div>
      <div className="chat-box">
        {session.messages.map((m, i) => (
          <div key={i} className={`message-row ${m.role === "user" ? "user" : "opponent"}`}>
            {m.role !== "user" && <span className="corner-badge them">THEM</span>}
            <div className={`bubble ${m.role === "user" ? "user" : "opponent"}`}>
              {m.content}
            </div>
            {m.role === "user" && <span className="corner-badge you">YOU</span>}
          </div>
        ))}
      </div>
    </div>
  );
}