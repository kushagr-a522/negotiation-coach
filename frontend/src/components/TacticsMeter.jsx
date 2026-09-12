function getStatus(score) {
  if (score === 2) return { word: "Strong", color: "#4FA88A" };
  if (score === 1) return { word: "Attempted", color: "#E3A857" };
  return { word: "Missing", color: "#D9694F" };
}

function MeterRow({ label, score }) {
  const status = getStatus(score);
  return (
    <div className="meter-row">
      <div className="meter-label-row">
        <span>{label}</span>
        <span className="meter-word" style={{ color: status.color }}>{status.word}</span>
      </div>
      <div className="meter-bar-bg">
        <div
          className="meter-bar-fill"
          style={{ width: `${(score / 2) * 100}%`, background: status.color }}
        />
      </div>
    </div>
  );
}

export default function TacticsMeter({ score }) {
  if (!score) return null;

  return (
    <div className="meter-box">
      <div className="meter-title">Your Scorecard</div>
      <div className="meter-legend">Missing = didn't show it · Attempted = tried it · Strong = did it well</div>

      <MeterRow label="Anchoring" score={score.anchoring} />
      <MeterRow label="No Free Concessions" score={score.no_free_concession} />
      <MeterRow label="Leverage Used" score={score.leverage_use} />
      <MeterRow label="Confidence" score={score.calm_confidence} />

      <p className="meter-tip"><strong>Coach's tip:</strong> {score.feedback}</p>
    </div>
  );
}