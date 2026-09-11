import { useState } from "react";
import { sendMessage } from "../api";
import TacticsMeter from "./TacticsMeter";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [latestScore, setLatestScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newHistory = [...messages, { role: "user", content: input }];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const { ai_reply, score } = await sendMessage(messages, input);
      setLatestScore(score);
      setMessages([...newHistory, { role: "assistant", content: ai_reply }]);
    } catch (error) {
      console.error("Error talking to backend:", error);
    }

    setLoading(false);
  };

  return (
    <div>
      <div style={{ minHeight: "300px", border: "1px solid #ccc", borderRadius: "8px", padding: "10px" }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.role === "user" ? "right" : "left",
              margin: "8px 0",
            }}
          >
            <span style={{
              display: "inline-block",
              padding: "8px 12px",
              borderRadius: "12px",
              backgroundColor: m.role === "user" ? "#DCF8C6" : "#EAEAEA",
            }}>
              {m.content}
            </span>
          </div>
        ))}
        {loading && <p><em>AI is typing...</em></p>}
      </div>

      {latestScore && <TacticsMeter score={latestScore} />}

      <div style={{ marginTop: "10px", display: "flex" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your negotiation message..."
          style={{ flex: 1, padding: "8px" }}
        />
        <button onClick={handleSend} style={{ marginLeft: "8px", padding: "8px 16px" }}>
          Send
        </button>
      </div>
    </div>
  );
}