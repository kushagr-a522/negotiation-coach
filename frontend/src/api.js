const API_URL = "http://10.180.111.180:8000"; // update to your IP when connecting laptops

export async function sendMessage(sessionId, conversationHistory, latestMessage) {
  const response = await fetch(`${API_URL}/negotiate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      conversation_history: conversationHistory,
      latest_message: latestMessage,
    }),
  });
  return response.json();
}

export async function listSessions() {
  const response = await fetch(`${API_URL}/sessions`);
  return response.json();
}

export async function getSession(sessionId) {
  const response = await fetch(`${API_URL}/sessions/${sessionId}`);
  return response.json();
}