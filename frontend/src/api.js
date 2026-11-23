const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const TOKEN_KEY = "auth_token";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.error(e);
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.error(e);
  }
}

let onUnauthorized = null;
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

async function callServer(path, options) {
  const opts = options || {};
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token && !opts.skipAuth) {
    headers["Authorization"] = "Bearer " + token;
  }

  let response;
  try {
    response = await fetch(API_URL + path, {
      method: opts.method || "GET",
      headers: headers,
      body: opts.body,
    });
  } catch (e) {
    throw new Error("Couldn't reach the server. Check your connection and try again.");
  }

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (response.status === 401 && !opts.skipAuth) {
    clearToken();
    if (onUnauthorized) {
      onUnauthorized();
    }
    throw new ApiError("Session expired. Please log in again.", 401);
  }

  if (!response.ok) {
    const message = data && typeof data.detail === "string" ? data.detail : "Something went wrong.";
    throw new ApiError(message, response.status);
  }

  return data;
}

// ---------- auth ----------

export async function register(name, email, password) {
  const data = await callServer("/auth/register", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({ name: name, email: email, password: password }),
  });
  setToken(data.token);
  return data.user;
}

export async function login(email, password) {
  const data = await callServer("/auth/login", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({ email: email, password: password }),
  });
  setToken(data.token);
  return data.user;
}

export function getMe() {
  return callServer("/auth/me");
}

// ---------- app ----------

export function sendMessage(args) {
  return callServer("/negotiate", {
    method: "POST",
    body: JSON.stringify({
      session_id: args.sessionId,
      conversation_history: args.history,
      latest_message: args.message,
      score_history: args.scoreHistory || [],
      scenario: args.scenario || "salary",
      difficulty: args.difficulty || "medium",
      focus: args.focus || "general",
    }),
  });
}

export function listSessions() {
  return callServer("/sessions");
}

export function getSession(sessionId) {
  return callServer("/sessions/" + sessionId);
}

export function getStats() {
  return callServer("/stats");
}