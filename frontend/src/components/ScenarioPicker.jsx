const SCENARIOS = [
  { key: "salary", label: "Salary Negotiation", desc: "Negotiate your pay with a hiring manager" },
  { key: "freelance", label: "Freelance Rate", desc: "Negotiate your rate with a startup founder" },
  { key: "rent", label: "Apartment Rent", desc: "Negotiate rent terms with a landlord" },
];

export default function ScenarioPicker({ onSelect }) {
  return (
    <div className="scenario-picker">
      <h2 className="scenario-title">Choose your negotiation</h2>
      <div className="scenario-grid">
        {SCENARIOS.map((s) => (
          <button key={s.key} className="scenario-card" onClick={() => onSelect(s.key)}>
            <div className="scenario-label">{s.label}</div>
            <div className="scenario-desc">{s.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}