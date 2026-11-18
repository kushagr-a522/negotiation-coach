import { IconHome, IconPlay, IconHistory, IconBook, IconSettings } from "./Icons";

const NAV = [
  { id: "dashboard", label: "Dashboard", Icon: IconHome },
  { id: "practice", label: "Practice", Icon: IconPlay },
  { id: "history", label: "History", Icon: IconHistory },
  { id: "guide", label: "Scoring Guide", Icon: IconBook },
  { id: "settings", label: "Settings", Icon: IconSettings },
];

export default function Sidebar({ page, onNavigate }) {
  return (
    <aside className="app-sidebar">
      <div className="brand">
        <div className="brand-name">
          Negotiation<span>Coach</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`nav-item ${page === id ? "active" : ""}`}
            onClick={() => onNavigate(id)}
          >
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-promo">
        <div className="promo-trophy">
          <span className="promo-spark">✦</span>
          <span role="img" aria-label="Trophy">🏆</span>
          <span className="promo-spark">✦</span>
        </div>
        <p>
          Negotiate Better.
          <br />
          Grow Stronger.
        </p>
        <svg width="64" height="10" viewBox="0 0 64 10" aria-hidden="true">
          <path d="M2 8C20 2 40 2 62 5" stroke="#F58A3F" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </aside>
  );
}