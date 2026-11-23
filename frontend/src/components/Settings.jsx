import { useCallback, useEffect, useState } from "react";
import "./Settings.css";
import { getStats } from "../api";
import { IconSettings } from "./Icons";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Settings({ user, onLogout }) {
  const [conn, setConn] = useState("checking"); // checking | online | offline

  const checkConnection = useCallback(async () => {
    setConn("checking");
    try {
      await getStats();
      setConn("online");
    } catch (e) {
      setConn("offline");
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const connLabel = {
    checking: "Checking...",
    online: "Connected",
    offline: "Can't reach the server",
  }[conn];

  const name = user && user.name ? user.name : "";
  const email = user && user.email ? user.email : "";

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
            <h2>Account</h2>
            <p className="st-hint">Your sessions are saved to this account and follow you to any device.</p>
            <div className="st-id-row">
              <code className="st-id">{name}</code>
            </div>
            <div className="st-id-row">
              <code className="st-id">{email}</code>
            </div>
            <button type="button" className="st-btn danger" onClick={onLogout}>
              Log out
            </button>
          </section>
        </div>

        <div className="st-col">
          <section className="st-card">
            <h2>Connection</h2>
            <p className="st-hint">The backend this app talks to.</p>
            <div className="st-conn">
              <span className={"st-dot " + conn} />
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