import { useCallback, useEffect, useState } from "react";
import "./Settings.css";
import { getStats } from "../api";
import { IconSettings } from "./Icons";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Settings({ visitorId }) {
  const stored = localStorage.getItem("player_name") || "";
  const [name, setName] = useState(stored);
  const [justSaved, setJustSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [conn, setConn] = useState("checking"); // checking | online | offline

  const checkConnection = useCallback(async () => {
    setConn("checking");
    try {
      await getStats(visitorId);
      setConn("online");
    } catch {
      setConn("offline");
    }
  }, [visitorId]);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const handleSave = (e) => {
    e.preventDefault();
    const clean = name.trim();
    if (clean) localStorage.setItem("player_name", clean);
    else localStorage.removeItem("player_name");
    setName(clean);
    // Tells the welcome bar to refresh its name
    window.dispatchEvent(new Event("player-name-change"));
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1800);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(visitorId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked, the ID is still selectable on screen
    }
  };

  const handleFresh = () => {
    const ok = window.confirm(
      "Start fresh? This browser gets a new ID, so your History and stats will look empty. " +
        "Your old sessions stay on the server but won't show up here."
    );
    if (!ok) return;
    localStorage.setItem("visitor_id", crypto.randomUUID());
    window.location.reload();
  };

  const connLabel = {
    checking: "Checking...",
    online: "Connected",
    offline: "Can't reach the server",
  }[conn];

  return (
    <div className="st-page">
      <header className="st-head">
        <div className="st-head-icon">
          <IconSettings />
        </div>
        <div>
          <h1 className="st-title">
            <span>Settings</span>
          </h1>
          <p className="st-sub">Customize your experience</p>
        </div>
      </header>

      <div className="st-body">
        <div className="st-col">
          <section className="st-card">
            <h2>Your name</h2>
            <p className="st-hint">Shown in the welcome bar at the top.</p>
            <form className="st-name-row" onSubmit={handleSave}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should we call you?"
                maxLength={30}
              />
              <button type="submit" className="st-btn primary">
                {justSaved ? "Saved ✓" : "Save"}
              </button>
            </form>
          </section>

          <section className="st-card">
            <h2>Your data</h2>
            <p className="st-hint">
              Sessions are linked to this ID, which lives in this browser. There's no login.
            </p>
            <div className="st-id-row">
              <code className="st-id">{visitorId}</code>
              <button type="button" className="st-btn" onClick={handleCopy}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
            <button type="button" className="st-btn danger" onClick={handleFresh}>
              Start fresh
            </button>
          </section>
        </div>

        <div className="st-col">
          <section className="st-card">
            <h2>Connection</h2>
            <p className="st-hint">The backend this app talks to.</p>
            <div className="st-conn">
              <span className={`st-dot ${conn}`} />
              <span className="st-conn-label">{connLabel}</span>
              <button type="button" className="st-btn" onClick={checkConnection}>
                Check again
              </button>
            </div>
            <code className="st-url">{API_URL}</code>
          </section>

          <section className="st-card">
            <h2>About Negotiation Coach</h2>
            <p className="st-about">
              Practice real negotiations against an AI. Every message you send is scored from 0 to 2 on
              anchoring, no free concessions, leverage and calm confidence, so you can see exactly what
              to improve.
            </p>
            <p className="st-about">See the Scoring Guide for how each pillar works.</p>
          </section>
        </div>
      </div>
    </div>
  );
}