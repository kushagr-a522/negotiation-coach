import { IconBriefcase, IconRocket, IconHouse, IconChat } from "./Icons";

const OPPONENT_ICONS = {
  salary: IconBriefcase,
  freelance: IconRocket,
  rent: IconHouse,
};

export default function ChatBubble({ role, content, scenario, hint, typing = false }) {
  const isUser = role === "user";
  const Icon = OPPONENT_ICONS[scenario] || IconChat;
  const initial = (localStorage.getItem("player_name") || "Akanksha").charAt(0).toUpperCase();

  return (
    <div className={`ch-msg ${isUser ? "user" : "them"}`}>
      {!isUser && (
        <span className="ch-avatar them">
          <Icon />
        </span>
      )}

      <div className="ch-msg-body">
        <div className="ch-bubble">
          {typing ? (
            <span className="ch-dots">
              <i />
              <i />
              <i />
            </span>
          ) : (
            content
          )}
        </div>
        {hint && <span className="ch-hint">{hint}</span>}
      </div>

      {isUser && <span className="ch-avatar you">{initial}</span>}
    </div>
  );
}