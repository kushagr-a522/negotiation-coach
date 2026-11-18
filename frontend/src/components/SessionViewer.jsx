import { useEffect, useState } from "react";
import { getSession } from "../api";
import ChatBubble from "./ChatBubble";
import { IconHistory, IconArrowRight } from "./Icons";

export default function SessionViewer({ sessionId, onScoreUpdate, onContinue }) {
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setSession(null);
    setError(null);

    getSession(sessionId)
      .then((data) => {
        if (cancelled) return;
        setSession(data);
        onScoreUpdate(data.latest_score || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Couldn't load this negotiation.");
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (error) {
    return (
      <section className="ch-chat">
        <p className="ch-state error">{error}</p>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="ch-chat">
        <p className="ch-state">Loading...</p>
      </section>
    );
  }

  const scores = session.latest_score || [];

  return (
    <>
      <div className="ch-banner">
        <span className="ch-banner-icon">
          <IconHistory />
        </span>
        <span>Viewing a past negotiation</span>
        <button type="button" className="ch-continue" onClick={() => onContinue(session)}>
          <span>Continue negotiation</span>
          <IconArrowRight />
        </button>
      </div>

      <section className="ch-chat">
        <div className="ch-messages">
          {session.messages.map((m, i) => {
            const s = m.role === "user" ? scores[Math.floor(i / 2)] : null;
            return (
              <ChatBubble
                key={i}
                role={m.role}
                content={m.content}
                scenario={session.scenario}
                hint={s ? `${s.total_score}/8` : null}
              />
            );
          })}
        </div>
      </section>
    </>
  );
}