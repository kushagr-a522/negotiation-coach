import { useState } from "react";
import "./ScoringGuide.css";
import {
  IconBook,
  IconTargetMono,
  IconScaleLine,
  IconLayers,
  IconBarsUp,
  IconShieldMono,
  IconChevronDown,
  IconChevronRight,
} from "./Icons";

const PILLARS = [
  {
    key: "anchoring",
    label: "Anchoring",
    color: "#f7780f",
    question: "Did you state a clear position first?",
    detail: "Naming your number or ask early sets the range for the whole conversation.",
    Icon: IconScaleLine,
  },
  {
    key: "no_free_concession",
    label: "No Free Concessions",
    color: "#fa9a4a",
    question: "Did you ask for something in return?",
    detail: "Every time you give something up, get something back instead of just agreeing.",
    Icon: IconLayers,
  },
  {
    key: "leverage_use",
    label: "Leverage",
    color: "#fbb97d",
    question: "Did you mention alternatives or urgency?",
    detail: "Other offers, deadlines or options show you have a real choice.",
    Icon: IconBarsUp,
  },
  {
    key: "calm_confidence",
    label: "Confidence",
    color: "#fdd3ab",
    question: "Did you sound calm, not apologetic?",
    detail: "Steady, direct wording beats hedging and over-explaining.",
    Icon: IconShieldMono,
  },
];

const LEVELS = [
  { pts: 0, word: "Missing", text: "You didn't show it in this message." },
  { pts: 1, word: "Attempted", text: "You tried it, but it wasn't fully there." },
  { pts: 2, word: "Strong", text: "You did it well." },
];

// Donut geometry: four equal slices with a small gap between them
const R = 70;
const C = 2 * Math.PI * R;
const SEG = C / 4;
const GAP = 7;

export default function ScoringGuide() {
  const [open, setOpen] = useState("anchoring");

  return (
    <div className="sg-page">
      <header className="sg-head">
        <div className="sg-head-icon">
          <IconBook />
        </div>
        <div>
          <h1 className="sg-title">
            Scoring <span>Guide</span>
          </h1>
          <p className="sg-sub">Understand how your score is calculated</p>
        </div>
      </header>

      <div className="sg-body">
        {/* Left: how it works + donut */}
        <section className="sg-card sg-how">
          <h2>How It Works?</h2>
          <p className="sg-how-text">
            Every message you send is scored from 0 to 2 on four pillars. Add them up and each message
            can earn up to 8 points. Your overall score is the average across the whole negotiation.
          </p>

          <div className="sg-donut-wrap">
            <div className="sg-donut">
              <svg viewBox="0 0 200 200" aria-hidden="true">
                {PILLARS.map((p, i) => (
                  <circle
                    key={p.key}
                    cx="100"
                    cy="100"
                    r={R}
                    fill="none"
                    stroke={p.color}
                    strokeWidth="26"
                    strokeDasharray={`${SEG - GAP} ${C - (SEG - GAP)}`}
                    strokeDashoffset={-i * SEG}
                    transform="rotate(-90 100 100)"
                  />
                ))}
              </svg>
              <div className="sg-donut-center">
                <strong>8</strong>
                <span>Points</span>
              </div>
            </div>

            <ul className="sg-legend">
              {PILLARS.map((p) => (
                <li key={p.key}>
                  <span className="sg-dot" style={{ background: p.color }} />
                  <span>
                    {p.label}
                    <small>0-2 pts</small>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Right: the four pillars */}
        <section className="sg-card sg-criteria">
          <div className="sg-pill">
            <span className="sg-pill-icon">
              <IconTargetMono />
            </span>
            <span>Evaluation Criteria</span>
          </div>

          <div className="sg-list">
            {PILLARS.map((p) => {
              const isOpen = open === p.key;
              return (
                <div key={p.key} className={`sg-item ${isOpen ? "open" : ""}`}>
                  <button
                    type="button"
                    className="sg-item-btn"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : p.key)}
                  >
                    <span className="sg-item-icon">
                      <p.Icon />
                    </span>
                    <span className="sg-item-text">
                      <span className="sg-item-title">
                        {p.label} <em>(0-2 pts)</em>
                      </span>
                      <span className="sg-item-desc">{p.question}</span>
                    </span>
                    {isOpen ? <IconChevronDown /> : <IconChevronRight />}
                  </button>

                  {isOpen && (
                    <div className="sg-item-more">
                      <p>{p.detail}</p>
                      <ul>
                        {LEVELS.map((l) => (
                          <li key={l.pts}>
                            <b>{l.pts}</b>
                            <span>
                              <strong>{l.word}</strong> — {l.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}