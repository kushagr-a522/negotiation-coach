const API_URL = "http://localhost:8000"; // will update this later to connect to Kushagra's laptop

export async function sendMessage(conversationHistory, latestMessage) {
  const response = await fetch(`${API_URL}/negotiate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversation_history: conversationHistory,
      latest_message: latestMessage,
    }),
  });
  return response.json();
}