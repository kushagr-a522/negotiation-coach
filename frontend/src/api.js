const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function sendMessage(sessionId, conversationHistory, latestMessage, scoreHistory = [], scenario = "salary", visitorId = "anonymous") {
  const response = await fetch(`${API_URL}/negotiate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      visitor_id: visitorId,
      conversation_history: conversationHistory,
      latest_message: latestMessage,
      score_history: scoreHistory,
      scenario: scenario,
    }),
  });
  return response.json();
}

export async function listSessions(visitorId = "anonymous") {
  const response = await fetch(`${API_URL}/sessions?visitor_id=${visitorId}`);
  return response.json();
}

export async function getSession(sessionId) {
  const response = await fetch(`${API_URL}/sessions/${sessionId}`);
  return response.json();
}

export async function getStats(visitorId = "anonymous") {
  const response = await fetch(`${API_URL}/stats?visitor_id=${visitorId}`);
  return response.json();
}