import { IconArrowRight } from "./Icons";

function average(scores, key, max = 2) {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, s) => acc + (s[key] || 0), 0);
  return Math.round((sum / (scores.length * max)) * 100);
}

const CATEGORIES = [
  { key: "anchoring", label: "Anchoring" },
  { key: "no_free_concession", label: "No Free Concessions" },
  { key: "leverage_use", label: "Leverage Used" },
  { key: "calm_confidence", label: "Confidence" },
];

function getVerdict(percent) {
  if (percent >= 75) return { title: "Strong negotiation", text: "You stayed in control for most of this one." };
  if (percent >= 50) return { title: "Solid effort", text: "The basics are there. Tighten up the weaker pillars below." };
  return { title: "Room to grow", text: "Focus on the lowest pillar below next time." };
}

export default function FinalReport({ scoreHistory, onNewSession }) {
  const overall = average(scoreHistory, "total_score_normalized", 8);
  const rows = CATEGORIES.map((c) => ({ ...c, pct: average(scoreHistory, c.key) }));
  const best = rows.reduce((a, b) => (b.pct > a.pct ? b : a));
  const worst = rows.reduce((a, b) => (b.pct < a.pct ? b : a));
  const showInsight = best.pct !== worst.pct;
  const verdict = getVerdict(overall);
  const count = scoreHistory.length;

  return (
    <section className="ch-report">
      <div className="ch-report-top">
        <div
          className="ch-ring"
          style={{
            background: `conic-gradient(#f7780f ${overall * 3.6}deg, rgba(247, 120, 15, 0.16) ${overall * 3.6}deg)`,
          }}
        >
          <div className="ch-ring-inner">
            <strong>{overall}%</strong>
            <span>Overall</span>
          </div>
        </div>

        <div className="ch-report-copy">
          <p className="ch-eyebrow">Negotiation complete</p>
          <h2>{verdict.title}</h2>
          <p className="ch-report-text">{verdict.text}</p>
          <p className="ch-basis">
            Based on {count} message{count === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="ch-bars">
        {rows.map((r) => (
          <div key={r.key}>
            <div className="ch-meter-top">
              <span>{r.label}</span>
              <span>{r.pct}%</span>
            </div>
            <div className="ch-bar">
              <div className="ch-bar-fill" style={{ width: `${r.pct}%`, background: "#f7780f" }} />
            </div>
          </div>
        ))}
      </div>

      {showInsight && (
        <div className="ch-insight">
          <div>
            <b>Strongest</b>
            {best.label} ({best.pct}%)
          </div>
          <div>
            <b>Work on</b>
            {worst.label} ({worst.pct}%)
          </div>
        </div>
      )}

      <button type="button" className="ch-new" onClick={onNewSession}>
        <span>Start new negotiation</span>
        <IconArrowRight />
      </button>
    </section>
  );
}