const LEVELS = {
  2: { word: "Strong", color: "#4fa83d" },
  1: { word: "Attempted", color: "#f2a23a" },
  0: { word: "Missing", color: "#d9694f" },
};

const IDLE = { word: "—", color: "#d9c4b6" };

function MeterRow({ label, score }) {
  const idle = score === undefined || score === null;
  const status = idle ? IDLE : LEVELS[score] || LEVELS[0];
  const width = idle ? 0 : (score / 2) * 100;

  return (
    <div className="ch-meter-row">
      <div className="ch-meter-top">
        <span>{label}</span>
        <span className="ch-meter-word" style={{ color: status.color }}>
          {status.word}
        </span>
      </div>
      <div className="ch-bar">
        <div className="ch-bar-fill" style={{ width: `${width}%`, background: status.color }} />
      </div>
    </div>
  );
}

export default function TacticsMeter({ score }) {
  const has = !!score;

  return (
    <section className="ch-card">
      <div className="ch-card-head">
        <h2>Your Scorecard</h2>
        {has && score.total_score !== undefined && <span className="ch-total">{score.total_score}/8</span>}
      </div>
      <p className="ch-legend">0 Missing · 1 Attempted · 2 Strong (latest message)</p>

      <MeterRow label="Anchoring" score={score?.anchoring} />
      <MeterRow label="No Free Concessions" score={score?.no_free_concession} />
      <MeterRow label="Leverage Used" score={score?.leverage_use} />
      <MeterRow label="Confidence" score={score?.calm_confidence} />

      <p className="ch-tip">
        <strong>Coach's tip</strong>
        {has ? score.feedback : "Send your first message and it gets scored here."}
      </p>
    </section>
  );
}