import { useState } from "react";
import "./ScenarioPicker.css";
import {
  IconBriefcase,
  IconRocket,
  IconHouse,
  IconList,
  IconSettings,
  IconInfo,
  IconCheck,
  IconPlay,
  IconArrowRight,
  IconChevronDown,
} from "./Icons";

const SCENARIOS = [
  { key: "salary", label: "Salary Negotiation", desc: "Negotiate your pay with a hiring manager", Icon: IconBriefcase, tone: "strong" },
  { key: "freelance", label: "Freelance Rate", desc: "Negotiate your rate with a startup founder", Icon: IconRocket, tone: "soft" },
  { key: "rent", label: "Apartment Rent", desc: "Negotiate rent terms with a landlord", Icon: IconHouse, tone: "strong" },
  { key: "other", label: "Other Scenarios", desc: "Explore more scenarios coming soon!", emoji: "🤝", tone: "soft", disabled: true },
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const FOCUS_AREAS = [
  "General Negotiation",
  "Anchoring",
  "No Free Concessions",
  "Leverage",
  "Calm Confidence",
];

export default function ScenarioPicker({ onSelect }) {
  const [selected, setSelected] = useState("salary");
  const [difficulty, setDifficulty] = useState("Medium");
  const [focus, setFocus] = useState(FOCUS_AREAS[0]);

  const handleStart = () => {
    onSelect(selected, { difficulty, focus });
  };

  return (
    <div className="pp-page">
      <div className="pp-hero">
        <h1 className="pp-title">
          Practice Your <span>Negotiation</span>
        </h1>
        <p className="pp-subtitle">
          Choose a scenario, get into the conversation, and see how you perform!
        </p>
        <svg className="pp-squiggle" viewBox="0 0 360 90" fill="none" aria-hidden="true">
          <path
            d="M6 70C70 40 150 30 230 52C280 66 320 56 342 34"
            stroke="#f7780f"
            strokeWidth="2"
            strokeDasharray="6 7"
            strokeLinecap="round"
          />
          <path d="M318 10l-6 22M334 18l-14 14M346 30l-18 8" stroke="#f7780f" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="pp-grid">
        <section className="pp-card">
          <div className="pp-pill">
            <IconList />
            <span>Select a Scenario</span>
          </div>

          <div className="pp-scenarios">
            {SCENARIOS.map((s) => (
              <button
                key={s.key}
                type="button"
                disabled={s.disabled}
                aria-pressed={selected === s.key}
                className={`pp-scenario ${selected === s.key ? "selected" : ""}`}
                onClick={() => setSelected(s.key)}
              >
                <div className={`pp-icon ${s.tone}`}>
                  {s.Icon ? <s.Icon /> : <span className="pp-icon-emoji" role="img" aria-label="Handshake">{s.emoji}</span>}
                </div>
                <div>
                  <div className="pp-scenario-label">{s.label}</div>
                  <div className="pp-scenario-desc">{s.desc}</div>
                </div>
                {selected === s.key && (
                  <span className="pp-check">
                    <IconCheck />
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="pp-card">
          <div className="pp-pill">
            <IconSettings />
            <span>Practice Settings</span>
          </div>

          <div className="pp-label">
            Difficulty Level <IconInfo />
          </div>
          <div className="pp-diff">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                className={difficulty === d ? "active" : ""}
                onClick={() => setDifficulty(d)}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="pp-label">
            Focus Area (Optional) <IconInfo />
          </div>
          <div className="pp-select-wrap">
            <select value={focus} onChange={(e) => setFocus(e.target.value)}>
              {FOCUS_AREAS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <IconChevronDown />
          </div>

          <button type="button" className="pp-start" onClick={handleStart}>
            <IconPlay />
            <span>Start Practice</span>
            <IconArrowRight />
          </button>
        </section>
      </div>
    </div>
  );
}