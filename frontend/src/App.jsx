import { useState } from "react";
import HistorySidebar from "./components/HistorySidebar";
import ChatWindow from "./components/ChatWindow";
import SessionViewer from "./components/SessionViewer";
import TacticsMeter from "./components/TacticsMeter";
import OverallGauge from "./components/OverallGauge";
import FinalReport from "./components/FinalReport";
import "./styles.css";

function App() {
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const [viewingSessionId, setViewingSessionId] = useState(null);
  const [latestScore, setLatestScore] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [overallPercent, setOverallPercent] = useState(0);
  const [reportData, setReportData] = useState(null);

  const handleNewSession = () => {
    setSessionId(crypto.randomUUID());
    setViewingSessionId(null);
    setLatestScore(null);
    setOverallPercent(0);
    setReportData(null);
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

  return (
    <div className="dashboard-grid">
      <HistorySidebar
        activeSessionId={viewingSessionId || sessionId}
        onSelectSession={setViewingSessionId}
        onNewSession={handleNewSession}
        refreshKey={refreshKey}
      />

      <div className="main-column">
        <div className="match-header">
          <span className="corner-tag you">YOU</span>
          <span className="vs-divider">vs</span>
          <span className="corner-tag them">HIRING MANAGER</span>
          {!reportData && <OverallGauge percent={overallPercent} />}
        </div>

        {reportData ? (
          <FinalReport scoreHistory={reportData} onNewSession={handleNewSession} />
        ) : viewingSessionId ? (
          <SessionViewer sessionId={viewingSessionId} onScoreUpdate={setLatestScore} />
        ) : (
          <ChatWindow
            sessionId={sessionId}
            onMessageSent={handleMessageSent}
            onScoreUpdate={handleScoreUpdate}
            onEndNegotiation={handleEndNegotiation}
          />
        )}
      </div>

      <div className="right-panel">
        {!reportData && <TacticsMeter score={latestScore} />}
      </div>
    </div>
  );
}

export default App;