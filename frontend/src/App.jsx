import { useState } from "react";
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
import "./shell.css";
import "./components/Chat.css";

const SCENARIO_LABELS = {
  salary: "HIRING MANAGER",
  freelance: "STARTUP FOUNDER",
  rent: "LANDLORD",
};

const getVisitorId = () => {
  let id = localStorage.getItem("visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("visitor_id", id);
  }
  return id;
};

function App() {
  const [visitorId] = useState(getVisitorId);
  const [page, setPage] = useState("dashboard");
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const [viewingSessionId, setViewingSessionId] = useState(null);
  const [latestScore, setLatestScore] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [overallPercent, setOverallPercent] = useState(0);
  const [reportData, setReportData] = useState(null);
  const [scenario, setScenario] = useState(null);
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

  const handleNewSession = () => {
    resetSession();
    setScenario(null);
    setPage("dashboard");
  };

  const handlePickScenario = (key) => {
    resetSession();
    setScenario(key);
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
    setResumeData(session);
    setViewingSessionId(null);
    setReportData(null);
    setPage("practice");
  };

  const showPicker = !scenario && !viewingSessionId;

  return (
    <div className="app-frame">
      <Sidebar page={page} onNavigate={setPage} />

      <div className="app-main">
        <Navbar />

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
            <div className={`ch-page ${reportData ? "solo" : ""}`} hidden={page !== "practice"}>
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
                    visitorId={visitorId}
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
                    <button type="button" className="ch-end" onClick={() => handleEndNegotiation(scoreHistory)}>
                      End negotiation & see report
                    </button>
                  )}
                </aside>
              )}
            </div>
          )}

          {page === "history" && (
            <History visitorId={visitorId} refreshKey={refreshKey} onSelectSession={handleSelectSession} />
          )}

          {page === "guide" && <ScoringGuide />}

          {page === "settings" && <Settings visitorId={visitorId} />}
        </main>
      </div>
    </div>
  );
}

export default App;