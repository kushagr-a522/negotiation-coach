import { useState } from "react";
import "./Dashboard.css";
import {
  IconChat,
  IconChevronRight,
  IconBriefcase,
  IconRocket,
  IconHouse,
  IconScaleLine,
  IconLayers,
  IconBarsUp,
  IconShieldMono,
  IconTrophyLine,
} from "./Icons";

const SCENARIOS = [
  { key: "salary", label: "Salary Negotiation", desc: "Negotiate your pay with a hiring manager", Icon: IconBriefcase, tone: "" },
  { key: "freelance", label: "Freelance Rate", desc: "Negotiate your rate with a startup founder", Icon: IconRocket, tone: "soft" },
  { key: "rent", label: "Apartment Rent", desc: "Negotiate rent terms with a landlord", Icon: IconHouse, tone: "" },
];

const CRITERIA = [
  { Icon: IconScaleLine, name: "Anchoring", text: "Did you state a clear position first?" },
  { Icon: IconLayers, name: "No Free Concessions", text: "Did you ask for something in return?" },
  { Icon: IconBarsUp, name: "Leverage", text: "Did you mention alternatives or urgency?" },
  { Icon: IconShieldMono, name: "Confidence", text: "Did you sound calm, not apologetic?" },
];

export default function Dashboard({ onPickScenario, onOpenGuide }) {
  const [name, setName] = useState(localStorage.getItem("player_name") || "");

  const handleName = (e) => {
    setName(e.target.value);
    localStorage.setItem("player_name", e.target.value);
  };

  return (
    <div className="db-grid">
      {/* Left: choose a scenario */}
      <section className="db-center">
        <div className="db-welcome-pill">WELCOME</div>

        <h1 className="db-heading">
          Choose a negotiation to
          <span className="db-practice">
            practice
            <svg className="db-swoosh" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true">
              <path d="M2 9C70 3 180 0 298 3C190 3.5 80 6 2 9Z" fill="#f7780f" />
            </svg>
          </span>
        </h1>

        <label className="db-name">
          <IconChat />
          <input value={name} onChange={handleName} placeholder="What should we call you?" />
        </label>

        <div className="db-scenarios">
          {SCENARIOS.map(({ key, label, desc, Icon, tone }) => (
            <button key={key} type="button" className="db-scenario" onClick={() => onPickScenario?.(key)}>
              <div className={`db-sc-icon ${tone}`}>
                <Icon />
              </div>
              <div className="db-sc-text">
                <div className="db-sc-title">{label}</div>
                <div className="db-sc-desc">{desc}</div>
              </div>
              <IconChevronRight />
            </button>
          ))}
        </div>
      </section>

      {/* Right: how you're scored */}
      <aside className="db-crit-card" aria-label="How you're scored">
        <div className="db-crit-head">
          <div className="db-crit-trophy">
            <IconTrophyLine />
          </div>
          <div>
            <div className="db-crit-heading">How You're Scored</div>
            <div className="db-crit-sub">Every message you send is evaluated on:</div>
          </div>
        </div>

        {CRITERIA.map(({ Icon, name: label, text }) => {
          const clickable = Boolean(onOpenGuide);
          const Row = clickable ? "button" : "div";
          return (
            <Row
              key={label}
              className={`db-crit ${clickable ? "clickable" : ""}`}
              {...(clickable ? { type: "button", onClick: onOpenGuide } : {})}
            >
              <div className="db-crit-tile">
                <Icon />
              </div>
              <div className="db-crit-text">
                <div className="db-crit-title">{label}</div>
                <div className="db-crit-desc">{text}</div>
              </div>
              {clickable && <IconChevronRight />}
            </Row>
          );
        })}
      </aside>
    </div>
  );
}