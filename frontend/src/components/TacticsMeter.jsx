export default function TacticsMeter({ score }) {
  if (!score) return null;

  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "12px",
      margin: "10px 0",
      backgroundColor: "#f9f9f9"
    }}>
      <p>Anchoring: {score.anchoring}/2</p>
      <p>No Free Concessions: {score.no_free_concession}/2</p>
      <p>Leverage Used: {score.leverage_use}/2</p>
      <p>Confidence: {score.calm_confidence}/2</p>
      <p><strong>Tip:</strong> {score.feedback}</p>
    </div>
  );
}