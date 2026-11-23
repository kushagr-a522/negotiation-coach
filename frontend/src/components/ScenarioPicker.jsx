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
import { IconTag } from "./ExtraIcons";

const SCENARIOS = [
  { key: "salary", label: "Salary Negotiation", desc: "Negotiate your pay with a hiring manager", Icon: IconBriefcase, tone: "strong" },
  { key: "freelance", label: "Freelance Rate", desc: "Negotiate your rate with a startup founder", Icon: IconRocket, tone: "soft" },
  { key: "rent", label: "Apartment Rent", desc: "Negotiate rent terms with a landlord", Icon: IconHouse, tone: "strong" },
  { key: "marketplace", label: "Marketplace Deal", desc: "Negotiate the price of a used laptop with a seller", Icon: IconTag, tone: "soft" },
];

const DIFFICULTIES = [
  { key: "easy", label: "Easy", hint: "A flexible opponent who gives ground after a reasonable argument." },
  { key: "medium", label: "Medium", hint: "A balanced opponent who concedes only for a real justification." },
  { key: "hard", label: "Hard", hint: "A guarded opponent who concedes in small steps, and only for evidence or leverage." },
];

const FOCUS_AREAS = [
  { key: "general", label: "General Negotiation" },
  { key: "anchoring", label: "Anchoring" },
  { key: "no_free_concession", label: "No Free Concessions" },
  { key: "leverage_use", label: "Leverage" },
  { key: "calm_confidence", label: "Calm Confidence" },
];

export default function ScenarioPicker({ onSelect }) {
  const [selected, setSelected] = useState("salary");
  const [difficulty, setDifficulty] = useState("medium");
  const [focus, setFocus] = useState("general");

  const currentDifficulty = DIFFICULTIES.find((d) => d.key === difficulty);

  const handleStart = () => {
    onSelect(selected, { difficulty: difficulty, focus: focus });
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
                aria-pressed={selected === s.key}
                className={"pp-scenario " + (selected === s.key ? "selected" : "")}
                onClick={() => setSelected(s.key)}
              >
                <div className={"pp-icon " + s.tone}>
                  <s.Icon />
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
            Difficulty Level{" "}
            <span title="Changes how tough the AI opponent is to negotiate with.">
              <IconInfo />
            </span>
          </div>
          <div className="pp-diff">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.key}
                type="button"
                className={difficulty === d.key ? "active" : ""}
                onClick={() => setDifficulty(d.key)}
              >
                {d.label}
              </button>
            ))}
          </div>
          <p className="pp-hint">{currentDifficulty.hint}</p>

          <div className="pp-label">
            Focus Area (Optional){" "}
            <span title="The coach's tip after each message will focus on this skill.">
              <IconInfo />
            </span>
          </div>
          <div className="pp-select-wrap">
            <select value={focus} onChange={(e) => setFocus(e.target.value)}>
              {FOCUS_AREAS.map((f) => (
                <option key={f.key} value={f.key}>
                  {f.label}
                </option>
              ))}
            </select>
            <IconChevronDown />
          </div>
          <p className="pp-hint">The coach's tip after each message will focus on this skill.</p>

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