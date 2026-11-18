import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./History.css";
import { listSessions, getSession, getStats } from "../api";
import {
  IconHistory,
  IconStar,
  IconArrowRight,
  IconChevronRight,
  IconBriefcase,
  IconRocket,
  IconHouse,
} from "./Icons";

const SCENARIOS = {
  salary: { label: "Salary Negotiation", Icon: IconBriefcase, tone: "" },
  freelance: { label: "Freelance Rate", Icon: IconRocket, tone: "soft" },
  rent: { label: "Apartment Rent", Icon: IconHouse, tone: "" },
};

function IconTrophy() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 3h10v5a5 5 0 0 1-10 0V3z" />
      <path
        d="M7 5H4v2a3.5 3.5 0 0 0 3.2 3.5M17 5h3v2a3.5 3.5 0 0 1-3.2 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M11 13h2v3h-2zM8 19h8v2H8z" />
    </svg>
  );
}

function IconTrend() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

function IconBars() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="4" y="12" width="4" height="8" rx="1" />
      <rect x="10" y="7" width="4" height="13" rx="1" />
      <rect x="16" y="3" width="4" height="17" rx="1" />
    </svg>
  );
}

// Average of the per-message totals (each out of 8) as a 0-100 number
function scorePercent(detail) {
  const scores = detail?.latest_score || [];
  if (scores.length === 0) return null;
  const sum = scores.reduce((acc, s) => acc + (s.total_score || 0), 0);
  return Math.round((sum / (scores.length * 8)) * 100);
}

// Works if the backend sends an ISO string or a unix timestamp. Returns null if there is none.
function pickDate(obj) {
  const raw = obj?.created_at ?? obj?.updated_at ?? obj?.timestamp ?? null;
  if (raw === null || raw === undefined) return null;
  const d = new Date(typeof raw === "number" && raw < 1e12 ? raw * 1000 : raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatWhen(d) {
  const day = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  return `${day} • ${time}`;
}

export default function History({ visitorId, refreshKey, onSelectSession }) {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [list, st] = await Promise.all([
          listSessions(visitorId),
          getStats(visitorId).catch(() => null),
        ]);

        // Only look inside the 20 most recent so this stays quick
        const recent = list.slice(0, 20);
        const details = await Promise.allSettled(recent.map((s) => getSession(s.id)));
        if (cancelled) return;

        const merged = recent.map((s, i) => {
          const d = details[i].status === "fulfilled" ? details[i].value : null;
          return {
            ...s,
            scenario: d?.scenario || s.scenario || null,
            when: pickDate(d) || pickDate(s),
            percent: d ? scorePercent(d) : null,
          };
        });

        // If every session has a date, sort newest first. Otherwise trust the server's order.
        if (merged.every((m) => m.when)) {
          merged.sort((a, b) => b.when - a.when);
        }

        setStats(st);
        setSessions(merged);
      } catch (err) {
        if (!cancelled) setError(err.message || "Couldn't load your history.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [visitorId, refreshKey]);

  // Last 5 scored sessions, oldest on the left
  const chartData = sessions
    .filter((s) => s.percent !== null)
    .slice(0, 5)
    .reverse()
    .map((s, i) => ({
      label: `#${i + 1}`,
      score: s.percent,
      title: SCENARIOS[s.scenario]?.label || s.preview,
    }));

  const improvement =
    chartData.length >= 2 ? chartData[chartData.length - 1].score - chartData[0].score : null;

  const totalSessions = stats?.total_sessions ?? sessions.length;
  const avgScore = stats?.avg_score_percent ?? 0;

  const visible = showAll ? sessions : sessions.slice(0, 3);

  let note = { title: "Keep practicing", text: "Finish a few sessions to see your trend." };
  if (improvement !== null && improvement > 0) {
    note = { title: "Great progress!", text: "Your negotiation skills are improving." };
  } else if (improvement !== null && improvement < 0) {
    note = { title: "Small dip", text: "Check your scorecard tips and try again." };
  } else if (improvement === 0) {
    note = { title: "Holding steady", text: "Your last sessions scored about the same." };
  }

  return (
    <div className="hs-page">
      <header className="hs-head">
        <div className="hs-head-icon">
          <IconHistory />
        </div>
        <div>
          <h1 className="hs-title">
            Your <span>History</span>
          </h1>
          <p className="hs-sub">Track your progress and past sessions</p>
        </div>
      </header>

      <div className="hs-body">
        {/* Left: stats + recent sessions */}
        <div className="hs-left">
          <div className="hs-stats">
            <div className="hs-card hs-stat">
              <div className="hs-stat-icon"><IconTrophy /></div>
              <div className="hs-stat-label">Total Sessions</div>
              <div className="hs-stat-value">{totalSessions}</div>
            </div>
            <div className="hs-card hs-stat">
              <div className="hs-stat-icon"><IconStar /></div>
              <div className="hs-stat-label">Avg Score</div>
              <div className="hs-stat-value">{avgScore}%</div>
            </div>
            <div className="hs-card hs-stat">
              <div className="hs-stat-icon"><IconTrend /></div>
              <div className="hs-stat-label">Improvement</div>
              <div className="hs-stat-value">
                {improvement === null ? "—" : `${improvement > 0 ? "+" : ""}${improvement}%`}
              </div>
            </div>
          </div>

          <section className="hs-recent">
            <div className="hs-recent-head">
              <h2>Recent Sessions</h2>
              {sessions.length > 3 && (
                <button type="button" className="hs-viewall" onClick={() => setShowAll((v) => !v)}>
                  <span>{showAll ? "Show less" : "View all"}</span>
                  <IconArrowRight />
                </button>
              )}
            </div>

            <div className="hs-list">
              {loading && <p className="hs-empty">Loading your sessions...</p>}
              {!loading && error && <p className="hs-empty hs-error">{error}</p>}
              {!loading && !error && sessions.length === 0 && (
                <p className="hs-empty">No sessions yet. Finish a negotiation and it will show up here.</p>
              )}

              {!loading &&
                !error &&
                visible.map((s) => {
                  const meta = SCENARIOS[s.scenario];
                  const Icon = meta?.Icon || IconBriefcase;
                  return (
                    <button key={s.id} type="button" className="hs-row" onClick={() => onSelectSession(s.id)}>
                      <div className={`hs-row-icon ${meta?.tone || ""}`}>
                        <Icon />
                      </div>
                      <div className="hs-row-text">
                        <span className="hs-row-name">{meta?.label || s.preview}</span>
                        <span className="hs-row-meta">
                          {s.when ? formatWhen(s.when) : `${s.message_count} messages`}
                        </span>
                      </div>
                      <span
                        className={`hs-pill ${
                          s.percent === null ? "none" : s.percent >= 75 ? "good" : ""
                        }`}
                      >
                        {s.percent === null ? "—" : `${s.percent}%`}
                      </span>
                      <IconChevronRight />
                    </button>
                  );
                })}
            </div>
          </section>
        </div>

        {/* Right: chart + progress note */}
        <div className="hs-right">
          <section className="hs-card hs-chart-card">
            <div className="hs-chart-head">
              <span className="hs-chart-icon"><IconBars /></span>
              <h2>Performance Chart</h2>
            </div>

            {chartData.length === 0 ? (
              <p className="hs-empty">Your chart appears after your first scored session.</p>
            ) : (
              <>
                <div className="hs-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
                      <defs>
                        <linearGradient id="hsFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f7780f" stopOpacity={0.28} />
                          <stop offset="100%" stopColor="#f7780f" stopOpacity={0.03} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(247,120,15,0.16)" />
                      <XAxis dataKey="label" stroke="#2b2420" fontSize={13} tickLine={false} />
                      <YAxis
                        domain={[0, 100]}
                        ticks={[0, 25, 50, 75, 100]}
                        stroke="#2b2420"
                        fontSize={13}
                        tickLine={false}
                      />
                      <Tooltip
                        formatter={(v) => [`${v}%`, "Score"]}
                        labelFormatter={(_, p) => p?.[0]?.payload?.title || ""}
                        contentStyle={{ borderRadius: 12, border: "1px solid #fbd6ba", fontSize: 13 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#f7780f"
                        strokeWidth={3}
                        fill="url(#hsFill)"
                        dot={{ r: 5, fill: "#f7780f", stroke: "#f7780f" }}
                        activeDot={{ r: 7 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="hs-chart-note">Your last {chartData.length} sessions, oldest to newest</p>
              </>
            )}
          </section>

          <section className="hs-card hs-progress">
            <div className="hs-progress-icon"><IconStar /></div>
            <div>
              <div className="hs-progress-title">{note.title}</div>
              <div className="hs-progress-text">{note.text}</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}