import ChatWindow from "./components/ChatWindow";

function App() {
  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Negotiation Coach</h1>
      <ChatWindow />
    </div>
  );
}

export default App;