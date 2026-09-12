import { useEffect, useState } from "react";
import { getSession } from "../api";

export default function SessionViewer({ sessionId, onScoreUpdate }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    getSession(sessionId).then((data) => {
      setSession(data);
      const scores = data.latest_score || [];
      onScoreUpdate(scores[scores.length - 1] || null);
    });
  }, [sessionId]);

  if (!session) return <div className="center-panel"><p className="chat-empty-hint">Loading...</p></div>;

  const scores = session.latest_score || [];

  return (
    <div className="center-panel">
      <div className="viewing-banner">Viewing a past negotiation (read-only)</div>
      <div className="chat-box">
        {session.messages.map((m, i) => (
          <div key={i}>
            <div className={`message-row ${m.role === "user" ? "user" : "opponent"}`}>
              {m.role !== "user" && <span className="corner-badge them">THEM</span>}
              <div className={`bubble ${m.role === "user" ? "user" : "opponent"}`}>
                {m.content}
              </div>
              {m.role === "user" && <span className="corner-badge you">YOU</span>}
            </div>
            {m.role === "user" && scores[Math.floor(i / 2)] && (
              <p className="inline-score-hint">
                Score: {scores[Math.floor(i / 2)].total_score}/8
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}