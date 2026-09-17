import { useState } from "react";

const SCENARIOS = [
  { key: "salary", label: "Salary Negotiation", desc: "Negotiate your pay with a hiring manager" },
  { key: "freelance", label: "Freelance Rate", desc: "Negotiate your rate with a startup founder" },
  { key: "rent", label: "Apartment Rent", desc: "Negotiate rent terms with a landlord" },
];

export default function ScenarioPicker({ onSelect }) {
  const [name, setName] = useState(localStorage.getItem("player_name") || "");

  const handleNameChange = (e) => {
    setName(e.target.value);
    localStorage.setItem("player_name", e.target.value);
  };

  return (
    <div className="scenario-picker">
      <input
        className="name-input"
        placeholder="What should we call you?"
        value={name}
        onChange={handleNameChange}
      />
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