const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Thrown when the server answered, but with an error status (400, 404, 500...)
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json();
      if (typeof body.detail === "string") detail = body.detail;
    } catch {
      // body wasn't JSON, fall back to the status code below
    }
    throw new ApiError(detail || `Request failed (${response.status})`, response.status);
  }

  return response.json();
}

export function sendMessage(
  sessionId,
  conversationHistory,
  latestMessage,
  scoreHistory = [],
  scenario = "salary",
  visitorId = "anonymous"
) {
  return request("/negotiate", {
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
}

export function listSessions(visitorId = "anonymous") {
  return request(`/sessions?visitor_id=${encodeURIComponent(visitorId)}`);
}

export function getSession(sessionId) {
  return request(`/sessions/${encodeURIComponent(sessionId)}`);
}

export function getStats(visitorId = "anonymous") {
  return request(`/stats?visitor_id=${encodeURIComponent(visitorId)}`);
}