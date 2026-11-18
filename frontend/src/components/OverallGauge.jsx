export default function OverallGauge({ percent }) {
  const angle = (percent / 100) * 360;

  return (
    <div
      className="ch-gauge"
      role="img"
      aria-label={`Match score ${percent} percent`}
      style={{
        background: `conic-gradient(#f7780f ${angle}deg, rgba(247, 120, 15, 0.16) ${angle}deg)`,
      }}
    >
      <div className="ch-gauge-inner">
        <strong>{percent}%</strong>
        <span>Match</span>
      </div>
    </div>
  );
}