import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import History from "./components/History";
import Settings from "./components/Settings";
import ChatWindow from "./components/ChatWindow";
import SessionViewer from "./components/SessionViewer";
import TacticsMeter from "./components/TacticsMeter";
import ScoreChart from "./components/ScoreChart";
import OverallGauge from "./components/OverallGauge";
import FinalReport from "./components/FinalReport";
import ScenarioPicker from "./components/ScenarioPicker";
import ScoringGuide from "./components/ScoringGuide";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import { getToken, clearToken, getMe, setUnauthorizedHandler } from "./api";
import "./shell.css";
import "./components/Chat.css";

const SCENARIO_LABELS = {
  salary: "HIRING MANAGER",
  freelance: "STARTUP FOUNDER",
  rent: "LANDLORD",
  marketplace: "SELLER",
};

function App() {
  const [user, setUser] = useState(null);
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const [viewingSessionId, setViewingSessionId] = useState(null);
  const [latestScore, setLatestScore] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [overallPercent, setOverallPercent] = useState(0);
  const [reportData, setReportData] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [focus, setFocus] = useState("general");
  const [resumeData, setResumeData] = useState(null);

  const resetSession = () => {
    setSessionId(crypto.randomUUID());
    setViewingSessionId(null);
    setLatestScore(null);
    setScoreHistory([]);
    setOverallPercent(0);
    setReportData(null);
    setResumeData(null);
  };

  // ---------- login ----------

  const applyUser = (u) => {
    try {
      localStorage.setItem("player_name", u.name);
    } catch (e) {
      console.error(e);
    }
    setUser(u);
  };

  const handleLoggedOut = () => {
    try {
      localStorage.removeItem("player_name");
    } catch (e) {
      console.error(e);
    }
    resetSession();
    setScenario(null);
    setDifficulty("medium");
    setFocus("general");
    setRefreshKey(0);
    setPage("dashboard");
    setUser(null);
  };

  const handleLogout = () => {
    clearToken();
    handleLoggedOut();
  };

  useEffect(() => {
    setUnauthorizedHandler(() => handleLoggedOut());

    if (!getToken()) {
      setCheckingLogin(false);
      return;
    }

    getMe()
      .then((u) => applyUser(u))
      .catch(() => setUser(null))
      .finally(() => setCheckingLogin(false));
  }, []);

  // ---------- practice flow ----------

  const handleNewSession = () => {
    resetSession();
    setScenario(null);
    setPage("dashboard");
  };

  const handlePickScenario = (key, options) => {
    const opts = options || {};
    resetSession();
    setScenario(key);
    setDifficulty(opts.difficulty || "medium");
    setFocus(opts.focus || "general");
    setPage("practice");
  };

  const handleSelectSession = (id) => {
    setViewingSessionId(id);
    setReportData(null);
    setLatestScore(null);
    setScoreHistory([]);
    setPage("practice");
  };

  const handleMessageSent = () => setRefreshKey((k) => k + 1);

  // Live chat: a new message was scored
  const handleScoreUpdate = (score, allScores) => {
    setLatestScore(score);
    setScoreHistory(allScores);
    const avg = allScores.length
      ? allScores.reduce((acc, s) => acc + s.total_score_normalized, 0) / (allScores.length * 8)
      : 0;
    setOverallPercent(Math.round(avg * 100));
  };

  // Past session: scores were loaded
  const handleViewerScores = (scores) => {
    setLatestScore(scores[scores.length - 1] || null);
    setScoreHistory(scores);
  };

  const handleEndNegotiation = (scores) => {
    setReportData(scores);
  };

  const handleContinue = (session) => {
    setSessionId(session.id);
    setScenario(session.scenario || "salary");
    setDifficulty("medium");
    setFocus("general");
    setResumeData(session);
    setViewingSessionId(null);
    setReportData(null);
    setPage("practice");
  };

  const showPicker = !scenario && !viewingSessionId;

  // ---------- gate: nothing below renders unless logged in ----------

  if (checkingLogin) {
    return (
      <div style={{ padding: 24 }}>
        Loading... the server may take up to a minute to wake up.
      </div>
    );
  }

  if (!user) {
    return <Login onAuthenticated={applyUser} />;
  }

  return (
    <div className="app-frame">
      <Sidebar page={page} onNavigate={setPage} />

      <div className="app-main">
        <Navbar user={user} onLogout={handleLogout} />

        <main className="page-body">
          {page === "dashboard" && (
            <Dashboard
              onPickScenario={handlePickScenario}
              onOpenGuide={() => setPage("guide")}
            />
          )}

          {page === "practice" && showPicker && <ScenarioPicker onSelect={handlePickScenario} />}

          {/* Kept mounted (just hidden) so switching pages doesn't wipe a live chat */}
          {!showPicker && (
            <div className={"ch-page " + (reportData ? "solo" : "")} hidden={page !== "practice"}>
              <div className="ch-main">
                {scenario && !viewingSessionId && (
                  <div className="ch-head">
                    <span className="ch-tag you">YOU</span>
                    <span className="ch-vs">vs</span>
                    <span className="ch-tag them">{SCENARIO_LABELS[scenario]}</span>
                    {!reportData && <OverallGauge percent={overallPercent} />}
                  </div>
                )}

                {reportData ? (
                  <FinalReport scoreHistory={reportData} onNewSession={handleNewSession} />
                ) : viewingSessionId ? (
                  <SessionViewer
                    sessionId={viewingSessionId}
                    onScoreUpdate={handleViewerScores}
                    onContinue={handleContinue}
                  />
                ) : (
                  <ChatWindow
                    key={sessionId}
                    sessionId={sessionId}
                    scenario={scenario}
                    difficulty={difficulty}
                    focus={focus}
                    resumeData={resumeData}
                    onMessageSent={handleMessageSent}
                    onScoreUpdate={handleScoreUpdate}
                  />
                )}
              </div>

              {!reportData && (
                <aside className="ch-side">
                  <TacticsMeter score={latestScore} />
                  <ScoreChart scoreHistory={scoreHistory} />
                  {!viewingSessionId && scoreHistory.length > 0 && (
                    <button
                      type="button"
                      className="ch-end"
                      onClick={() => handleEndNegotiation(scoreHistory)}
                    >
                      End negotiation & see report
                    </button>
                  )}
                </aside>
              )}
            </div>
          )}

          {page === "history" && (
            <History
              visitorId={user.id}
              refreshKey={refreshKey}
              onSelectSession={handleSelectSession}
            />
          )}

          {page === "guide" && <ScoringGuide />}

          {page === "settings" && <Settings visitorId={user.id} user={user} onLogout={handleLogout} />}
        </main>
      </div>
    </div>
  );
}

export default App;