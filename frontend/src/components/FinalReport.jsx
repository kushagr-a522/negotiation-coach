function average(scores, key) {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, s) => acc + (s[key] || 0), 0);
  return Math.round((sum / (scores.length * 2)) * 100);
}

export default function FinalReport({ scoreHistory, onNewSession }) {
  const overall = average(scoreHistory, "total_score_normalized");

  const categories = [
    { key: "anchoring", label: "Anchoring" },
    { key: "no_free_concession", label: "No Free Concessions" },
    { key: "leverage_use", label: "Leverage Used" },
    { key: "calm_confidence", label: "Confidence" },
  ];

  return (
    <div className="report-card">
      <div className="report-headline">Negotiation complete</div>
      <div className="report-overall">{overall}%</div>
      <div className="report-overall-label">Overall negotiation strength</div>

      <div className="report-bars">
        {categories.map((c) => {
          const pct = average(scoreHistory, c.key);
          return (
            <div key={c.key} className="report-bar-row">
              <div className="report-bar-label">
                <span>{c.label}</span>
                <span>{pct}%</span>
              </div>
              <div className="meter-bar-bg">
                <div className="meter-bar-fill glow-fill" style={{ width: `${pct}%`, background: "#E8A33D" }} />
              </div>
            </div>
          );
        })}
      </div>

      <button className="new-session-btn full-width" onClick={onNewSession}>Start new negotiation</button>
    </div>
  );
}