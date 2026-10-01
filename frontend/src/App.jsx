import { useState } from "react";
import Navbar from "./components/Navbar";
import HistorySidebar from "./components/HistorySidebar";
import ChatWindow from "./components/ChatWindow";
import SessionViewer from "./components/SessionViewer";
import TacticsMeter from "./components/TacticsMeter";
import OverallGauge from "./components/OverallGauge";
import FinalReport from "./components/FinalReport";
import ScenarioPicker from "./components/ScenarioPicker";
import ScoringGuide from "./components/ScoringGuide";
import "./styles.css";

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
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const [viewingSessionId, setViewingSessionId] = useState(null);
  const [latestScore, setLatestScore] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [overallPercent, setOverallPercent] = useState(0);
  const [reportData, setReportData] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  const handleNewSession = () => {
    setSessionId(crypto.randomUUID());
    setViewingSessionId(null);
    setLatestScore(null);
    setOverallPercent(0);
    setReportData(null);
    setScenario(null);
    setResumeData(null);
  };

  const handleMessageSent = () => setRefreshKey((k) => k + 1);

  const handleScoreUpdate = (score, allScores) => {
    setLatestScore(score);
    const avg =
      allScores.reduce((acc, s) => acc + s.total_score_normalized, 0) /
      (allScores.length * 8);
    setOverallPercent(Math.round(avg * 100));
  };

  const handleEndNegotiation = (scoreHistory) => {
    setReportData(scoreHistory);
  };

  const handleContinue = (session) => {
    setSessionId(session.id);
    setScenario(session.scenario || "salary");
    setResumeData(session);
    setViewingSessionId(null);
    setReportData(null);
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-grid">
        <HistorySidebar
          activeSessionId={viewingSessionId || sessionId}
          onSelectSession={setViewingSessionId}
          onNewSession={handleNewSession}
          refreshKey={refreshKey}
          visitorId={visitorId}
        />

        <div className="main-column">
          {scenario && (
            <div className="match-header">
              <span className="corner-tag you">YOU</span>
              <span className="vs-divider">vs</span>
              <span className="corner-tag them">{SCENARIO_LABELS[scenario]}</span>
              {!reportData && <OverallGauge percent={overallPercent} />}
            </div>
          )}

          {!scenario && !viewingSessionId ? (
            <ScenarioPicker onSelect={setScenario} />
          ) : reportData ? (
            <FinalReport scoreHistory={reportData} onNewSession={handleNewSession} />
          ) : viewingSessionId ? (
            <SessionViewer
              sessionId={viewingSessionId}
              onScoreUpdate={setLatestScore}
              onContinue={handleContinue}
            />
          ) : (
            <ChatWindow
              sessionId={sessionId}
              scenario={scenario}
              visitorId={visitorId}
              resumeData={resumeData}
              onMessageSent={handleMessageSent}
              onScoreUpdate={handleScoreUpdate}
              onEndNegotiation={handleEndNegotiation}
            />
          )}
        </div>

        <div className="right-panel">
          {!reportData && scenario && <TacticsMeter score={latestScore} />}
          {!scenario && !viewingSessionId && <ScoringGuide />}
        </div>
      </div>
    </>
  );
}

export default App;