import { useState, useEffect, useRef } from "react";
import { sendMessage, ApiError } from "../api";
import ChatBubble from "./ChatBubble";
import { IconChat, IconArrowRight } from "./Icons";

export default function ChatWindow({ sessionId, onMessageSent, onScoreUpdate, scenario, visitorId, resumeData }) {
  const [messages, setMessages] = useState(resumeData?.messages || []);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [scoreHistory, setScoreHistory] = useState(
    (resumeData?.latest_score || []).map((s) => ({ ...s, total_score_normalized: s.total_score }))
  );
  const [errorMsg, setErrorMsg] = useState(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (resumeData) {
      setMessages(resumeData.messages || []);
      const normalized = (resumeData.latest_score || []).map((s) => ({ ...s, total_score_normalized: s.total_score }));
      setScoreHistory(normalized);
      if (normalized.length > 0) onScoreUpdate(normalized[normalized.length - 1], normalized);
    }
  }, [resumeData]);

  // Keep the newest message in view
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setErrorMsg(null);

    const newHistory = [...messages, { role: "user", content: text }];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const { ai_reply, score } = await sendMessage(sessionId, messages, text, scoreHistory, scenario, visitorId);
      const normalizedScore = { ...score, total_score_normalized: score.total_score };
      const updatedScores = [...scoreHistory, normalizedScore];
      setScoreHistory(updatedScores);
      onScoreUpdate(normalizedScore, updatedScores);
      setMessages([...newHistory, { role: "assistant", content: ai_reply }]);
      onMessageSent();
    } catch (error) {
      console.error("Error talking to backend:", error);
      // Put the message back so nothing is lost
      setMessages(messages);
      setInput(text);
      setErrorMsg(
        error instanceof ApiError
          ? `The server had a problem: ${error.message}`
          : "Couldn't reach the negotiation server. Check your connection and try again."
      );
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <section className="ch-chat">
      <div className="ch-messages" ref={listRef}>
        {messages.length === 0 && !loading && (
          <div className="ch-empty">
            <span className="ch-empty-icon">
              <IconChat />
            </span>
            <h3>Start the negotiation</h3>
            <p>Try opening with your target number.</p>
          </div>
        )}

        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} content={m.content} scenario={scenario} />
        ))}

        {loading && <ChatBubble role="assistant" scenario={scenario} typing />}
      </div>

      {errorMsg && <div className="ch-error">{errorMsg}</div>}

      <div className="ch-input">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your negotiation message..."
        />
        <button type="button" className="ch-send" onClick={handleSend} disabled={loading || !input.trim()}>
          <span>Send</span>
          <IconArrowRight />
        </button>
      </div>
    </section>
  );
}