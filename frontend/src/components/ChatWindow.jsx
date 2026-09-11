import { useState } from "react";
import { sendMessage } from "../api";

export default function ChatWindow({ sessionId, onMessageSent, onScoreUpdate, onEndNegotiation }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [scoreHistory, setScoreHistory] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newHistory = [...messages, { role: "user", content: input }];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const { ai_reply, score } = await sendMessage(sessionId, messages, input);
      const normalizedScore = {
        ...score,
        total_score_normalized: score.total_score,
      };
      const updatedScores = [...scoreHistory, normalizedScore];
      setScoreHistory(updatedScores);
      onScoreUpdate(normalizedScore, updatedScores);
      setMessages([...newHistory, { role: "assistant", content: ai_reply }]);
      onMessageSent();
    } catch (error) {
      console.error("Error talking to backend:", error);
    }

    setLoading(false);
  };

  return (
    <div className="center-panel">
      <div className="chat-box">
        {messages.length === 0 && (
          <p className="chat-empty-hint">Start negotiating — try opening with your target number.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`message-row ${m.role === "user" ? "user" : "opponent"}`}>
            {m.role !== "user" && <span className="corner-badge them">THEM</span>}
            <div className={`bubble ${m.role === "user" ? "user" : "opponent"}`}>
              {m.content}
            </div>
            {m.role === "user" && <span className="corner-badge you">YOU</span>}
          </div>
        ))}
        {loading && (
          <div className="message-row opponent">
            <span className="corner-badge them">THEM</span>
            <div className="bubble opponent typing-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
      </div>

      <div className="input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your negotiation message..."
        />
        <button onClick={handleSend}>SEND</button>
      </div>

      {messages.length > 0 && (
        <button
          className="end-negotiation-btn"
          onClick={() => onEndNegotiation(scoreHistory)}
        >
          End negotiation & see report
        </button>
      )}
    </div>
  );
}