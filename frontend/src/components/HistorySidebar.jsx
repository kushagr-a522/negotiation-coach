import { useEffect, useState } from "react";
import { listSessions } from "../api";

export default function HistorySidebar({ activeSessionId, onSelectSession, onNewSession, refreshKey }) {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    listSessions().then(setSessions).catch(() => setSessions([]));
  }, [refreshKey]);

  return (
    <div className="sidebar-panel">
      <button className="new-session-btn" onClick={onNewSession}>+ New Negotiation</button>
      <div className="sidebar-title">Past Negotiations</div>
      {sessions.length === 0 && <p className="sidebar-empty">No negotiations yet</p>}
      {sessions.map((s) => (
        <div
          key={s.id}
          className={`session-item ${s.id === activeSessionId ? "active" : ""}`}
          onClick={() => onSelectSession(s.id)}
        >
          <div className="session-preview">{s.preview}</div>
          <div className="session-meta">{s.message_count} messages</div>
        </div>
      ))}
    </div>
  );
}