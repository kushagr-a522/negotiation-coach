import { useEffect, useState } from "react";
import { listSessions, getStats } from "../api";

export default function HistorySidebar({ activeSessionId, onSelectSession, onNewSession, refreshKey, visitorId }) {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    listSessions(visitorId).then(setSessions).catch(() => setSessions([]));
    getStats(visitorId).then(setStats).catch(() => setStats(null));
  }, [refreshKey, visitorId]);

  return (
    <div className="sidebar-panel">
      <button className="new-session-btn" onClick={onNewSession}>+ New Negotiation</button>

      {stats && stats.total_sessions > 0 && (
        <div className="stats-block">
          <div className="stats-row"><span>Total Sessions</span><span>{stats.total_sessions}</span></div>
          <div className="stats-row"><span>Avg Score</span><span>{stats.avg_score_percent}%</span></div>
        </div>
      )}

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