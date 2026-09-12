export default function OverallGauge({ percent }) {
  const angle = (percent / 100) * 360;
  return (
    <div className="gauge-wrap">
      <div
        className="gauge-ring"
        style={{
          background: `conic-gradient(#E8A33D ${angle}deg, #2a2035 ${angle}deg)`
        }}
      >
        <div className="gauge-inner">
          <span className="gauge-percent">{percent}%</span>
          <span className="gauge-label">Match Score</span>
        </div>
      </div>
    </div>
  );
}