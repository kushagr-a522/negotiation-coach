export default function ScoringGuide() {
  return (
    <div className="meter-box">
      <div className="meter-title">How You're Scored</div>
      <div className="meter-legend">Every message you send is evaluated on:</div>
      <ul className="scoring-guide-list">
        <li><strong>Anchoring</strong> — did you state a clear position first?</li>
        <li><strong>No Free Concessions</strong> — did you ask for something in return?</li>
        <li><strong>Leverage</strong> — did you mention alternatives or urgency?</li>
        <li><strong>Confidence</strong> — did you sound calm, not apologetic?</li>
      </ul>
    </div>
  );
}